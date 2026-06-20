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

    if "driving licence" in t or "driving license" in t or "transport" in t or "licensing authority" in t:
        return "DL"

    if re.search(r"\b\d{4}\s?\d{4}\s?\d{4}\b", t):
        return "AADHAAR"

    return "UNKNOWN"

# ---------------------------------------------------------
# AADHAAR EXTRACTION (Audited & Fixed)
# ---------------------------------------------------------

def extract_aadhaar(lines):
    aadhaar = None
    dob = None
    name = None

    # First, find DOB
    for i, l in enumerate(lines):
        m = re.search(r"\b(\d{2}/\d{2}/\d{4})\b", l)
        if m:
            dob = m.group(1)
            # NAME is typically 1–2 lines above DOB
            if i > 0 and re.match(r"^[A-Za-z ]{3,}$", lines[i - 1]):
                name = lines[i - 1]
            elif i > 1 and re.match(r"^[A-Za-z ]{3,}$", lines[i - 2]):
                name = lines[i - 2]
            break

    # Extract Aadhaar number: 12 digits, often in 4-4-4 format
    # Specifically matches 12 digits total, optionally separated by spaces or hyphens,
    # ensuring we do not grab parts of dates or DOBs.
    for l in lines:
        m = re.search(r"\b(\d{4})\s*(\d{4})\s*(\d{4})\b", l)
        if m:
            aadhaar = "".join(m.groups())
            break

    return {
        "name": name,
        "dob": dob,
        "aadhaar": aadhaar
    }

# ---------------------------------------------------------
# PAN EXTRACTION (Audited & Fixed)
# ---------------------------------------------------------

PAN_SKIP_WORDS = {
    "income", "tax", "department", "govt", "india", "permanent",
    "account", "number", "card", "government", "signature",
    "date", "birth", "fathers", "father", "name", "pan",
    "of", "the", "republic"
}

def is_pan_header_line(line: str) -> bool:
    """Check if a line is a PAN card header/label (not a person's name)."""
    words = set(re.findall(r"\b[a-z]+\b", line.lower()))
    if len(words) == 0:
        return True
    overlap = words & PAN_SKIP_WORDS
    return len(overlap) / len(words) >= 0.5


def extract_pan(lines):
    pan = None
    dob = None
    name = None
    father_name = None

    # Strict Indian PAN format: ABCDE1234F (5 letters + 4 digits + 1 letter)
    pan_regex = re.compile(r"\b([A-Z]{5}\d{4}[A-Z])\b")

    for l in lines:
        cleaned = l.replace(" ", "").upper()
        m = pan_regex.search(cleaned)
        if m:
            pan = m.group(1)

        d = re.search(r"\b(\d{2}/\d{2}/\d{4})\b", l)
        if d:
            dob = d.group(1)

    # Name extraction → pick valid English name lines, skip headers/labels
    english_names = []
    for l in lines:
        stripped = l.strip()
        if re.match(r"^[A-Za-z ]{3,}$", stripped) and not is_pan_header_line(stripped):
            english_names.append(stripped)

    # PAN card: first clean name = cardholder, second = father's name
    if len(english_names) >= 1:
        name = english_names[0]
    if len(english_names) >= 2:
        father_name = english_names[1]

    result = {
        "name": name,
        "dob": dob,
        "pan": pan
    }
    if father_name:
        result["father_name"] = father_name

    return result

# ---------------------------------------------------------
# DRIVING LICENCE EXTRACTION (Audited & Fixed)
# ---------------------------------------------------------

DL_SKIP_WORDS = {
    "driving", "licence", "license", "transport", "authority",
    "government", "india", "state", "union", "republic",
    "motor", "vehicle", "department", "licensing", "rto",
    "validity", "issue", "date", "blood", "group", "address",
    "form", "class", "non", "cov", "mcwg", "lmv", "card"
}

def is_dl_header_line(line: str) -> bool:
    """Check if a line is a DL header/label (not a person's name)."""
    words = set(re.findall(r"\b[a-z]+\b", line.lower()))
    if len(words) == 0:
        return True
    overlap = words & DL_SKIP_WORDS
    return len(overlap) / len(words) >= 0.4


def extract_dl(lines):
    name = None
    dob = None
    dl_no = None
    doi = None       # date of issue
    validity = None  # expiry/validity

    # Indian DL number: State code (2 letters) + 11-13 digits/hyphens/spaces
    for l in lines:
        cleaned = l.replace(" ", "").replace("-", "").upper()
        m = re.search(r"\b([A-Z]{2}\d{11,13})\b", cleaned)
        if m:
            dl_no = m.group(1)
            break

    # Extract all DD/MM/YYYY dates
    all_dates = []
    for l in lines:
        dates_in_line = re.findall(r"\b(\d{2}/\d{2}/\d{4})\b", l)
        all_dates.extend(dates_in_line)

    # DOB is first, DOI is second, validity is third
    if len(all_dates) >= 1:
        dob = all_dates[0]
    if len(all_dates) >= 2:
        doi = all_dates[1]
    if len(all_dates) >= 3:
        validity = all_dates[2]

    # Name detection
    # Method 1: Look for line with "Name" label
    for i, l in enumerate(lines):
        if re.search(r"\bname\b", l.lower()) and "father" not in l.lower():
            after = re.split(r"[:\-]", l, maxsplit=1)
            if len(after) > 1 and re.match(r"^[A-Za-z ]{3,}$", after[1].strip()):
                name = after[1].strip()
                break
            if i + 1 < len(lines) and re.match(r"^[A-Za-z ]{3,}$", lines[i + 1].strip()) and not is_dl_header_line(lines[i + 1].strip()):
                name = lines[i + 1].strip()
                break

    # Method 2: S/D/W pattern
    if not name:
        for i, l in enumerate(lines):
            if "s/d/w" in l.lower() or "son" in l.lower() or "wife" in l.lower() or "daughter" in l.lower():
                if i > 0 and re.match(r"^[A-Za-z ]{3,}$", lines[i - 1]) and not is_dl_header_line(lines[i - 1]):
                    name = lines[i - 1]
                break

    # Method 3: Fallback first clean name
    if not name:
        for l in lines:
            stripped = l.strip()
            if re.match(r"^[A-Z][A-Za-z ]{3,}$", stripped) and not is_dl_header_line(stripped):
                name = stripped
                break

    result = {
        "name": name,
        "dob": dob,
        "dl_number": dl_no
    }
    if doi:
        result["date_of_issue"] = doi
    if validity:
        result["validity"] = validity

    return result

# ---------------------------------------------------------
# FRAUD CHECK (Improved)
# ---------------------------------------------------------

def fraud_check(data):
    flags = []

    if not data.get("name"):
        flags.append("name_missing")

    if data.get("aadhaar") and len(data["aadhaar"]) != 12:
        flags.append("invalid_aadhaar")

    if data.get("pan") and not re.match(r"^[A-Z]{5}\d{4}[A-Z]$", data["pan"]):
        flags.append("invalid_pan_format")

    if data.get("dl_number"):
        clean_dl = data["dl_number"].replace(" ", "").replace("-", "")
        if len(clean_dl) < 10:
            flags.append("invalid_dl_number")

    if not (data.get("aadhaar") or data.get("pan") or data.get("dl_number")):
        flags.append("id_missing")

    if not data.get("dob"):
        flags.append("dob_missing")

    score = (len(flags) * 15)

    return flags, min(score, 100)

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
    uvicorn.run(app, host="0.0.0.0", port=8080, reload=False)
