# ---------------------------------------------------------
# FASTAPI OCR SERVER – PRODUCTION READY (PAN / AADHAAR / DL)
# ---------------------------------------------------------

import re
import uvicorn
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import easyocr

# ---------------------------------------------------------
# INITIALIZE
# ---------------------------------------------------------

reader = easyocr.Reader(["en"], gpu=False)
app = FastAPI(title="OCR Verification API", version="3.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------
# CLEANUP
# ---------------------------------------------------------

def clean_text(text: str) -> str:
    text = re.sub(r"[^\x20-\x7E\n]", "", text)  # remove garbage symbols
    text = re.sub(r"\s+", " ", text)            # normalize spaces
    return text.strip()


def normalize_lines(text: str) -> list:
    lines = []
    for l in text.split("\n"):
        l = l.strip()
        if len(l) > 1 and l not in lines:
            lines.append(l)
    return lines

# ---------------------------------------------------------
# CARD TYPE DETECTION
# ---------------------------------------------------------

def detect_card_type(text: str) -> str:
    t = text.lower()

    if "permanent account number" in t or "income tax" in t:
        return "PAN"

    if "driving licence" in t or "driving license" in t:
        return "DL"

    if re.search(r"\b\d{4}\s?\d{4}\s?\d{4}\b", t):
        return "AADHAAR"

    return "UNKNOWN"

# ---------------------------------------------------------
# AADHAAR EXTRACTION (Improved)
# ---------------------------------------------------------

def extract_aadhaar(lines):

    aadhaar = None
    dob = None
    name = None

    # Multi-line Aadhaar number (handles 4-4-4 broken lines)
    joined = " ".join(lines)
    multi = re.search(r"(\d{4})\D+(\d{4})\D+(\d{4})", joined)
    if multi:
        aadhaar = "".join(multi.groups())

    # DOB detection
    for i, l in enumerate(lines):
        m = re.search(r"\b(\d{2}/\d{2}/\d{4})\b", l)
        if m:
            dob = m.group(1)

            # NAME is 1–2 lines above
            if i > 0 and re.match(r"^[A-Za-z ]{3,}$", lines[i - 1]):
                name = lines[i - 1]
            elif i > 1 and re.match(r"^[A-Za-z ]{3,}$", lines[i - 2]):
                name = lines[i - 2]
            break

    return {
        "name": name,
        "dob": dob,
        "aadhaar": aadhaar
    }

# ---------------------------------------------------------
# PAN EXTRACTION (Improved Fuzzy Regex)
# ---------------------------------------------------------

def extract_pan(lines):

    pan = None
    dob = None
    name = None

    # Fuzzy PAN regex to handle OCR mistakes (0/O, 1/I)
    pan_regex = re.compile(r"[A-Z]{5}[A-Z0-9]{4}[A-Z]", re.I)

    for l in lines:
        m = pan_regex.search(l.replace(" ", ""))
        if m:
            pan = m.group(0)

        d = re.search(r"\b(\d{2}/\d{2}/\d{4})\b", l)
        if d:
            dob = d.group(1)

    # Name extraction → pick first 2 valid English lines
    english = [l for l in lines if re.match(r"^[A-Za-z ]{3,}$", l)]

    if len(english) >= 1:
        name = english[0]  # PAN has one clean name line

    return {
        "name": name,
        "dob": dob,
        "pan": pan
    }

# ---------------------------------------------------------
# DRIVING LICENCE EXTRACTION (Accurate)
# ---------------------------------------------------------

def extract_dl(lines):

    name = None
    dob = None
    dl_no = None

    # DL number (len >= 8 to avoid catching names)
    for l in lines:
        m = re.search(r"\b([A-Z0-9]{8,15})\b", l)
        if m:
            dl_no = m.group(1)

        d = re.search(r"\b(\d{2}/\d{2}/\d{4})\b", l)
        if d and not dob:
            dob = d.group(1)

    # Name detection – strong rule
    for i, l in enumerate(lines):
        if "s/d/w" in l.lower() or "son" in l.lower() or "wife" in l.lower():
            if i > 0 and re.match(r"^[A-Za-z ]{3,}$", lines[i - 1]):
                name = lines[i - 1]
            break

    # Fallback → first clean uppercase name
    if not name:
        for l in lines:
            if re.match(r"^[A-Z][A-Za-z ]{3,}$", l):
                name = l
                break

    return {
        "name": name,
        "dob": dob,
        "dl_number": dl_no
    }

# ---------------------------------------------------------
# FRAUD CHECK (Improved)
# ---------------------------------------------------------

def fraud_check(data):

    flags = []

    if not data.get("name"):
        flags.append("name_missing")

    if data.get("aadhaar") and len(data["aadhaar"]) != 12:
        flags.append("invalid_aadhaar")

    if not (data.get("aadhaar") or data.get("pan") or data.get("dl_number")):
        flags.append("id_missing")

    score = (len(flags) * 10)

    return flags, score

# ---------------------------------------------------------
# MAIN ENDPOINT
# ---------------------------------------------------------

@app.post("/ocr")
async def verify(file: UploadFile = File(...)):

    img = await file.read()
    result = reader.readtext(img, detail=0)
    raw = "\n".join(result)

    lines = normalize_lines(raw)
    cleaned = clean_text(raw)

    card = detect_card_type(cleaned)

    if card == "AADHAAR":
        extracted = extract_aadhaar(lines)
    elif card == "PAN":
        extracted = extract_pan(lines)
    elif card == "DL":
        extracted = extract_dl(lines)
    else:
        extracted = {"text": cleaned}

    flags, score = fraud_check(extracted)

    return {
        "card_type": card,
        "clean_text": "\n".join(lines),
        "extracted": extracted,
        "fraud_flags": flags,
        "fraud_score": score,
        "raw_text": raw
    }

# ---------------------------------------------------------
# RUN SERVER
# ---------------------------------------------------------

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=6001, reload=True)
