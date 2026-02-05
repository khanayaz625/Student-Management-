---
description: How to deploy and run the Classroom Management System
---

### Prerequisites
1. Install [Node.js](https://nodejs.org/)
2. Install [MongoDB](https://www.mongodb.com/try/download/community)

### Steps to Run Locally

#### 1. Start MongoDB
Ensure your MongoDB service is running on `localhost:27017`.

#### 2. Backend Setup
// turbo
1. Navigate to the server directory: `cd server`
2. Install dependencies: `npm install`
3. Configure environment variables in `.env` (already provided with defaults)
4. Start the server: `npm start` (or `node server.js`)

#### 3. Frontend Setup
// turbo
1. Navigate to the client directory: `cd client`
2. Install dependencies: `npm install`
3. Start the dev server: `npm run dev`
4. Open `http://localhost:5173` in your browser

### Admin Credentials
You can register a new account as a "Teacher" to access administrative features.
- Generate AI tasks for the class.
- Review student submissions.
- Monitor attendance and leaderboard statistics.
