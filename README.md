# 🚀 AI Resume Matcher & Screening MERN Stack

An intelligent MERN stack web application that uses **Google Gemini AI** (or Cohere AI) and **PDF Parsing** to evaluate candidates' resumes against job descriptions, calculate match scores (0-100), generate actionable feedback, and track submission history.

---

## 🌟 Key Features

- 📄 **PDF Resume Parser**: Automatically extracts text from uploaded PDF resumes.
- 🤖 **AI-Powered Screening**: Evaluates resume suitability against job descriptions using **Google Gemini AI** (or Cohere AI).
- 📊 **Match Score & Feedback**: Computes match percentage (0-100) and provides detailed recommendations.
- 🔒 **Firebase Authentication**: Secure Google Sign-In & authentication integration.
- 🗂️ **History & Admin View**: View past resume analysis records and candidate submissions.
- ⚡ **Vercel Serverless Ready**: Fully configured for 1-click deployment on Vercel.

---

## 🛠️ Tech Stack

### **Frontend (`/mern_ai`)**
- **React 19** + **Vite 7**
- **Material UI (MUI)** & **Emotion**
- **Firebase Auth** (Google Sign-In)
- **Axios** (Configured with dynamic API base URL)
- **React Router v7**

### **Backend (`/backend_ai`)**
- **Node.js** + **Express 5**
- **MongoDB** + **Mongoose**
- **Google Gen AI SDK** (`@google/genai`) & **Cohere AI SDK** (`cohere-ai`)
- **PDF Parse** & **Multer** (Memory buffer storage for serverless support)
- **Cors** & **Dotenv**

---

## 📋 Step-by-Step Setup Guide (MongoDB, Firebase & Gemini API)

### **1. MongoDB Atlas Setup (Free Cloud Database)**

> You don't need to manually create tables/collections — Mongoose will automatically create the `users` and `resumes` collections when the app runs!

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and create a **Free Account**.
2. Click **Create a Deployment** and select **M0 Free Shared Cluster**.
3. Under **Database Access**, create a database user:
   - Enter a **Username** and **Password** (save these!).
4. Under **Network Access**:
   - Click **Add IP Address** -> Select **Allow Access from Anywhere** (`0.0.0.0/0`) so Vercel & your local machine can connect.
5. Click **Database** -> **Connect** -> Choose **Drivers (Node.js)**.
6. Copy your Connection String. It will look like this:
   `mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/ai_resume?retryWrites=true&w=majority`
7. Replace `<username>` and `<password>` with your database user credentials. This is your `MONGODB_URI`!

---

### **2. Google Gemini API Setup (Free AI Key)**

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Sign in with your Google account.
3. Click **Create API Key**.
4. Copy the generated API key. This is your `GEMINI_API_KEY`!

---

### **3. Firebase Console Setup (Google Sign-In Authentication)**

1. Go to [Firebase Console](https://console.firebase.google.com/) and click **Add project**.
2. Name your project (e.g., `ai-resume-matcher`) and click **Continue**.
3. In the left sidebar, click **Build** -> **Authentication** -> **Get Started**.
4. Under **Sign-in method**, click **Google**, turn on **Enable**, set your support email, and click **Save**.
5. Under **Authentication** -> **Settings** -> **Authorized domains**:
   - Make sure `localhost` is listed.
   - Add your production Vercel domain (e.g., `your-app.vercel.app`).
6. Click the **Project Settings ⚙️** icon (top left next to Project Overview).
7. Scroll down to **Your apps** -> Click the **Web (</>) icon** to register a web app.
8. Enter an App nickname and click **Register app**.
9. Copy the `firebaseConfig` keys (`apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`).

---

## 🔑 Environment Variables Summary

### **Backend (`/backend_ai/.env` or Vercel Environment Variables)**

```ini
PORT=4000
FRONTEND_URL=http://localhost:5173
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/ai_resume?retryWrites=true&w=majority
GEMINI_API_KEY=your_gemini_api_key_here
```

### **Frontend (`/mern_ai/.env` or Vercel Environment Variables)**

```ini
VITE_API_BASE_URL=http://localhost:4000
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## ☁️ Deploying to Vercel

1. Push your project to GitHub.
2. Go to [Vercel Dashboard](https://vercel.com/new) and click **"Add New Project"**.
3. Import your repository (`public_ai_resume_mern`).
4. Under **Environment Variables**, paste:
   - `MONGODB_URI`
   - `GEMINI_API_KEY`
5. Click **Deploy**!

---

## 💻 Local Development Setup

### **1. Clone & Install**
```bash
git clone https://github.com/your-username/public_ai_resume_mern.git
cd public_ai_resume_mern

# Install backend dependencies
cd backend_ai && npm install

# Install frontend dependencies
cd ../mern_ai && npm install
```

### **2. Start Servers**
- Backend: `cd backend_ai && npm start` (runs on `http://localhost:4000`)
- Frontend: `cd mern_ai && npm run dev` (runs on `http://localhost:5173`)

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Backend status health check |
| `POST` | `/api/user` | Register/login user via Firebase Google Auth |
| `POST` | `/api/resume/addResume` | Upload resume (PDF) and generate AI match score |
| `GET` | `/api/resume/get/:user` | Retrieve user resume history |
| `GET` | `/api/resume/get` | Admin route to retrieve all resumes |
