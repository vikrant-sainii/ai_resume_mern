# 📚 AI Resume Screening MERN Stack — Pre-Interview Revision Guide

> **Quick Summary for Interviewers**:  
> "I built an **AI-powered Resume Screening & Matcher platform** using the **MERN Stack** (React 19, Vite, Express 5, Node.js, MongoDB Atlas) integrated with **Google Gemini AI** and **Firebase Authentication**. Candidates upload their PDF resume and paste a Job Description (JD). The backend parses the PDF in-memory, sends a structured prompt to Gemini AI to evaluate key skills and calculate a 0–100 match score with detailed feedback, and stores the candidate history in MongoDB. The frontend is deployed on **Vercel** and the backend on **Render.com**."

---

## 🎯 1. 30-Second Elevator Pitch

"This project solves a real-world HR recruitment problem: manually reviewing thousands of resumes against complex job descriptions is slow and subjective. My application automates candidate evaluation using **Google Gemini AI**. It parses PDF resumes on the fly, scores candidates against job descriptions, provides actionable feedback, and offers role-based dashboards for candidates and admin recruiters."

---

## 🏗️ 2. System Architecture & Request Lifecycle

### **System Architecture Diagram**

```
 ┌────────────────────────────────────────────────────────────────────────┐
 │                         FRONTEND (Vercel)                              │
 │  React 19 + Vite 7 | Material UI | Firebase Auth (Google OAuth 2.0)   │
 └───────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     │ HTTPS REST API Requests (Axios)
                                     ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │                         BACKEND (Render.com)                           │
 │  Node.js + Express 5 | Multer Memory Buffer | PDF-Parse Engine        │
 └───────────────┬───────────────────┬───────────────────┬────────────────┘
                 │                   │                   │
                 ▼                   ▼                   ▼
     ┌───────────────────────┐ ┌───────────────┐ ┌──────────────────────┐
     │   Google Gemini AI    │ │  Cohere AI    │ │    MongoDB Atlas     │
     │  (@google/genai SDK)  │ │ (Fallback AI) │ │ (User & Resume DB)   │
     └───────────────────────┘ └───────────────┘ └──────────────────────┘
```

### **Step-by-Step Data Flow (Resume Upload)**

1. **User Action**: Candidate selects a `.pdf` file and enters a Job Description on React UI.
2. **Frontend Request**: `axios.post('/api/resume/addResume', formData)` transmits `multipart/form-data` payload containing binary file buffer, `job_desc`, and `user` ID.
3. **Multer Middleware**: `upload.single("resume")` intercepts request, filters MIME type (`application/pdf`), and stores binary file in RAM memory buffer (`req.file.buffer`).
4. **PDF Extraction**: `pdf-parse` reads `req.file.buffer` and extracts raw unformatted text.
5. **AI Processing Pipeline**:
   - Construct structured prompt containing candidate's resume text + target JD.
   - Primary: Calls **Google Gemini AI SDK** (`gemini-2.5-flash`).
   - Secondary: Fallback to **Cohere AI** if Gemini key is absent.
   - Tertiary: Fallback to rule-based keyword matcher algorithm if AI services are unavailable.
6. **Response Parsing**: Regex extracts numerical `score` (0-100) and `feedback` text from AI response.
7. **Database Storage**: Mongoose creates a new `ResumeModel` document in MongoDB Atlas.
8. **UI Update**: Express returns JSON payload `{ data: newResume }`, updating React state and rendering the score ring and feedback card.

---

## 💻 3. Frontend Architecture (React 19 + Vite 7)

### **Key Technical Patterns**

- **State Management**: React **Context API** (`AuthContext.jsx`) manages global auth state (`isLogin`, `userInfo`, `setLogin`, `setUserInfo`).
- **Route Security (HOC)**: Higher Order Component `WithAuthHOC.jsx` wraps private components (`Dashboard`, `History`, `Admin`). If `localStorage.getItem('isLogin')` is absent, it redirects unauthenticated users to `/`.
- **Authentication**: Firebase Client SDK (`signInWithPopup(auth, provider)`). Upon successful Google sign-in, user info (`displayName`, `email`, `photoURL`) is saved locally and synced asynchronously with MongoDB via `/api/user`.
- **Dynamic API Base URL**: `axios.js` configures `baseURL: import.meta.env.VITE_API_BASE_URL` so frontend can communicate with local development server (`localhost:4000`) or production Render API (`https://ai-resume-backend-uwwi.onrender.com`).

---

## ⚙️ 4. Backend Architecture (Node.js + Express 5)

### **Key Technical Patterns**

- **Serverless/Cloud Connection Pooling**: `conn.js` implements a singleton connection pattern for Mongoose. Before calling `mongoose.connect()`, it checks `mongoose.connection.readyState === 1` to reuse existing connections across serverless/cloud requests.
- **In-Memory File Uploads**: Used `multer.memoryStorage()` instead of `diskStorage()`. Cloud hosts like Render & Vercel have ephemeral/read-only file systems; memory buffers ensure fast PDF parsing without disk I/O bottlenecks.
- **Resilient AI Failover**: Designed `evaluateResumeWithAI()` with a multi-provider fallback strategy (Gemini -> Cohere -> Algorithmic Matcher) ensuring 100% service uptime even if an external API encounters rate limits.
- **CORS Configuration**: Dynamic origin reflection (`cors({ credentials: true, origin: (origin, cb) => cb(null, true) })`) allows cross-origin requests between Vercel global edge CDN and Render servers.

---

## 🗄️ 5. Database Schemas (MongoDB & Mongoose)

### **User Schema (`Models/user.js`)**
```javascript
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    role: { type: String, default: "user" }, // 'user' or 'admin'
    photoUrl: { type: String }
}, { timestamps: true });
```

### **Resume Schema (`Models/resume.js`)**
```javascript
const ResumeSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    resume_name: { type: String, required: true },
    job_desc: { type: String, required: true },
    score: { type: String }, // e.g. "85"
    feedback: { type: String } // AI generated feedback & recommendations
}, { timestamps: true });
```

---

## 🚀 6. Top 10 Technical Interview Questions & Answers

### **Q1: Why did you use `multer.memoryStorage()` instead of `multer.diskStorage()`?**
> **Answer**: Disk storage writes uploaded files to local server folders (`uploads/`). In cloud environments like Render or Vercel, the filesystem is ephemeral and read-only. `memoryStorage()` keeps the uploaded file as a `Buffer` in RAM (`req.file.buffer`), enabling instant PDF text parsing via `pdf-parse` with zero disk I/O latency and zero storage cleanup maintenance.

### **Q2: How does Firebase Google Authentication work in your app?**
> **Answer**: Frontend invokes `signInWithPopup(auth, provider)` via Firebase Web SDK. Google handles OAuth 2.0 authentication and returns an ID token and user object (`displayName`, `email`, `photoURL`). My React client immediately updates `AuthContext` state and `localStorage`, then sends a non-blocking `POST /api/user` request to sync or create the user record in MongoDB Atlas.

### **Q3: How do you handle rate limits or outages from Google Gemini AI?**
> **Answer**: Implemented a multi-level fallback design pattern in `evaluateResumeWithAI()`. The system first attempts inference via Google Gemini SDK (`@google/genai`). If Gemini throws an error or rate limit, it catches the exception and falls back to Cohere AI SDK. If both external APIs fail, it executes a local fallback keyword match algorithm so the user experience never breaks.

### **Q4: Explain the Mongoose connection singleton pattern in `conn.js`.**
> **Answer**: `connectDB()` checks `if (isConnected && mongoose.connection.readyState === 1) return;`. In Node.js serverless and cloud hosting, new HTTP requests can re-trigger connection code. Checking `readyState` prevents memory leaks and connection limit exhaustion by reusing established MongoDB connection pools.

### **Q5: What is CORS and how did you resolve cross-origin issues between Vercel and Render?**
> **Answer**: CORS (Cross-Origin Resource Sharing) is a browser security mechanism that blocks web pages from making API requests to a different domain. Since frontend is on Vercel (`ai-resume-mern.vercel.app`) and backend is on Render (`ai-resume-backend-uwwi.onrender.com`), I configured Express CORS middleware with `credentials: true` and dynamic origin reflection to respond cleanly to browser preflight `OPTIONS` requests.

### **Q6: How does your Higher Order Component (`WithAuthHOC`) protect routes?**
> **Answer**: `WithAuthHOC` wraps private page components (`Dashboard`, `History`, `Admin`). In `useEffect()`, it reads `localStorage.getItem('isLogin')`. If absent, it invokes `navigate('/')` to force authentication before mounting protected components, preventing unauthorized route access.

### **Q7: Why did you choose Vite over Create React App (CRA)?**
> **Answer**: CRA uses Webpack, which bundles the entire application before starting the dev server. Vite uses native ES Modules (ESM) and Esbuild under the hood, offering instantaneous cold server start times, lightning-fast Hot Module Replacement (HMR), and much smaller production bundle sizes.

### **Q8: How did you fix the white screen error during React deployment?**
> **Answer**: The original template contained invalid comment tags (`{/* ... */}`) inside plain JavaScript function blocks. In browser environments, this caused an uncaught JS `SyntaxError` at runtime, causing React's render tree to crash. I refactored the component logic, removed the invalid comments, and implemented structured state routing.

### **Q9: Why was `0.0.0.0/0` whitelisted in MongoDB Atlas Network Access?**
> **Answer**: Render's free tier uses dynamic IP addresses for web services. Restricting MongoDB Atlas access to a static IP would cause `MongooseServerSelectionError`. Whitelisting `0.0.0.0/0` allows Render's cloud servers to connect securely while database security is enforced via strong username/password credentials.

### **Q10: How would you scale this application for 100,000 active users?**
> **Answer**: 
> 1. **Asynchronous Task Queues**: Move PDF parsing & AI generation to background worker threads using **BullMQ / Redis** so API requests return instantly with a `jobId`.
> 2. **Caching**: Cache frequent job description analysis responses in **Redis**.
> 3. **Database Indexing**: Add compound indexes on `{ user: 1, createdAt: -1 }` in MongoDB for sub-millisecond query speed.
> 4. **Horizontal Auto-scaling**: Scale backend stateless Express instances horizontally behind a Load Balancer.

---

## 🛠️ Quick Command Reference

```bash
# Start local backend
cd backend_ai && npm start

# Start local frontend
cd mern_ai && npm run dev

# Build frontend bundle
cd mern_ai && npm run build
```
