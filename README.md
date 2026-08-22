# 🚀 DayFlow — Work & HR Management Platform

<div align="center">

![Work in Progress](https://img.shields.io/badge/Status-Work_in_Progress-yellow?style=for-the-badge&logo=git)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![Stack](https://img.shields.io/badge/Stack-MERN_Stack-green?style=for-the-badge)

> **DayFlow is an all-in-one workforce management platform designed for attendance, leave management, payroll, employee profiles, and AI-driven assistant workflows.**

---

### 🚧 Project Status: Under Active Development

**Note:** This repository is currently **Under Progress**. Active refactoring, feature enhancements, deployment integrations (Render + Vercel), and security updates are actively being pushed.

---

</div>

## 📋 Overview

DayFlow simplifies day-to-day HR and workforce operations into a single unified dashboard for employees and HR administrators.

### Key Capabilities
- ⏱️ **Attendance Management**: AI-powered face detection (via `face-api.js`) and geolocation-verified check-in / check-out.
- 🏖️ **Leave Operations**: Leave applications, manager review/approvals, and balance tracking.
- 💰 **Payroll System**: Salary component structures, automated deductions, tax previews, and payslip generation.
- 👤 **Employee Management**: Profile management, image uploads via Cloudinary, and password onboarding.
- 🤖 **AI Support Assistant**: Integrated Chat AI assistant for quick HR query resolutions.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, Redux Toolkit, Tailwind CSS, Lucide Icons, Face-API.js |
| **Backend** | Node.js, Express.js, MongoDB Native Driver, JWT Authentication, Nodemailer, Cloudinary |
| **Cloud Services** | MongoDB Atlas, Render (Backend API), Vercel (Frontend Client) |

---

## ⚙️ Environment Variables Setup

### Backend Environment Variables (`Backend/.env`)
```env
NODE_ENV=development
PORT=5500
MONGO_URI=mongodb://localhost:27017/Attendance
MONGO_DB_NAME=Attendance
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:5173
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
SMTP_EMAIL=your_email@gmail.com
SMTP_PASS=your_app_password
GEMINI_API_KEY=your_gemini_api_key
```

### Frontend Environment Variables (`Frontend/.env`)
```env
VITE_API_URL=http://localhost:5500/api
```

---

## 🚀 Getting Started (Local Development)

### 1. Clone Repository
```bash
git clone https://github.com/Sharan-Sanadi/DayFlow.git
cd DayFlow
```

### 2. Start Backend Server
```bash
cd Backend
npm install
npm run dev
```
*Backend API will run at `http://localhost:5500`.*

### 3. Start Frontend Client
```bash
cd Frontend
npm install
npm run dev
```
*Frontend Application will run at `http://localhost:5173`.*

---

## 📂 Project Structure

```text
DayFlow/
├── Backend/              # Express API, MongoDB connection, routes & controllers
│   ├── config/           # Database & Cloudinary config
│   ├── middlewares/      # Auth & file upload middlewares
│   └── modules/          # Auth, Attendance, Leave, Payroll, Mail, AI routes
├── Frontend/             # React + Vite client app
│   ├── src/
│   │   ├── Components/   # Reusable UI components
│   │   ├── Pages/        # Admin & Employee screens
│   │   └── Redux/        # Global state management
│   └── vercel.json       # SPA routing configuration
└── README.md
```

---

## 📄 License
This project is licensed under the MIT License.
