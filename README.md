# AI-Powered Identity Verification and Fraud Detection for KYC Compliance

A full‑stack KYC verification system that combines **React (Vite)** for the frontend, **Node.js + Express** for backend APIs, and **Python (FastAPI + EasyOCR)** for document OCR and identity verification.

---

## 🧠 Project Architecture

The project consists of **three independent services**:

1. **Frontend** – React + Vite (User Interface)
2. **Backend** – Node.js + Express (API & logic)
3. **OCR Service** – Python + FastAPI + EasyOCR (Document text extraction)

All three must be running **at the same time**.

```
Frontend (5173)  →  Backend (5000)  →  OCR Service (8000)
```


## 🧰 Prerequisites

Make sure these are installed on your system:

* **Node.js** ≥ 18
* **npm** ≥ 9
* **Python** ≥ 3.9
* **pip** (Python package manager)

Check versions:

```bash
node -v
npm -v
python3 --version
pip3 --version
```

---

## 🚀 STEP 1: Run the Frontend (React + Vite)

### 📂 Go to frontend folder

```bash
cd Files
```

### 🧹 Clean install (recommended)

```bash
rm -rf node_modules package-lock.json
npm install
```

### ▶️ Start frontend dev server

```bash
npm run dev
```

### ✅ Output

```
VITE ready
Local: http://localhost:5173
```

Open in browser:

```
http://localhost:5173
```

---

## 🚀 STEP 2: Run the Backend (Node.js + Express)

### 📂 Go to backend folder

```bash
cd backend
```

### 📦 Install backend dependencies

```bash
npm install
```

If needed manually:

```bash
npm install express cors dotenv multer node-fetch
```

### ▶️ Start backend server

```bash
node index.js
```

### ✅ Output

```
🚀 Backend running at http://localhost:5000
```

---

## 🚀 STEP 3: Run the OCR Service (Python + FastAPI)

### 📂 Stay in backend folder

### 📦 Install Python dependencies

```bash
pip3 install fastapi uvicorn easyocr python-multipart
```

### ▶️ Start OCR server

```bash
uvicorn ocr_server:app --host 127.0.0.1 --port 8000
```

### ✅ Output

```
Uvicorn running on http://127.0.0.1:8000
```

### 🔍 Verify OCR server

Open in browser:

```
http://127.0.0.1:8000/docs
```

You should see **FastAPI Swagger UI**.

---

## 🔄 Required Startup Order

Always start services in this order:

1️⃣ OCR Server (Python)
2️⃣ Backend Server (Node)
3️⃣ Frontend (React)

If OCR is not running, backend will throw:

```
ECONNREFUSED 127.0.0.1:8000
```

---

## ⚠️ Common Errors & Fixes

### ❌ `ERR_MODULE_NOT_FOUND`

Cause: Dependencies not installed
Fix:

```bash
npm install
```

---

### ❌ `Cannot find package 'multer' / 'express'`

Fix:

```bash
npm install express multer
```

---

### ❌ `ECONNREFUSED 127.0.0.1:8000`

Cause: OCR server not running
Fix:

```bash
uvicorn ocr_server:app --port 8000
```

---

## 🏁 Final Notes

* Keep **3 terminals open** during development
* Always start OCR before backend
* Ignore Node warnings unless server crashes

---

## ✨ Author

**Kris Mehra**
AI‑Powered Identity Verification & Fraud Detection System
