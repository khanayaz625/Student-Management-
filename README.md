# EduScale - Classroom Management System

EduScale is a production-ready, AI-powered classroom management system designed to streamline tasks, attendance, and student performance tracking.

## 🚀 Features

- **Role-Based Access**: Specialized dashboards for Teachers (Admins) and Students.
- **AI Task Generation**: Teachers can generate logic-driven daily tasks using AI (OpenAI GPT).
- **Daily Attendance**: Easy one-click attendance marking for students.
- **Leaderboard**: dynamic student rankings based on attendance, task completion, and quality.
- **Student Profiles**: Customizable profiles with skill tracking and progress analytics.
- **Responsive UI**: Premium, modern design built with React and Vanilla CSS.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Lucide-React Icons, Chart.js.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose).
- **AI**: OpenAI API (with mock fallback for development).

## 📦 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (Running locally or on Atlas)

### 1. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/classroom_management
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key (optional)
```
Start the server:
```bash
npm start
```

### 2. Frontend Setup
```bash
cd client
npm install
npm run dev
```
Visit `http://localhost:5173` to view the application.

## 🗄️ Database Schema

- **Users**: Name, Email, Role, Roll Number, Class, Skills, Avatar.
- **Tasks**: Topic, Difficulty, Questions (JSON), Date, Deadline.
- **Submissions**: Answers, Score, Feedback, Status.
- **Attendance**: Student Reference, Date, Status.

## 🤖 AI Logic
The system uses GPT-3.5 to generate 5 logic-based, non-MCQ questions based on the topic taught. If no API key is provided, a curated set of mock logic questions is generated for development.

---
Built with ❤️ by Antigravity
