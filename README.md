# BuddyChat


BuddyChat is a premium, real-time messaging application built with the MERN stack (MongoDB, Express, React/Next.js, Node.js) and Socket.IO. It features a modern glassmorphism UI, secure Google Authentication, and instant message delivery.

Features
Real-time Messaging: Instant one-on-one chat powered by Socket.IO.
Premium UI/UX: Glassmorphism design, smooth animations, and responsive layout using Tailwind CSS.
Google Authentication: Secure and seamless login with Google Identity Services.
Presence System: Real-time online/offline status indicators.
Message Persistence: All conversations are stored securely in MongoDB.
Typing Experience: Optimistic UI updates for a snappy feel.

Tech Stack
Frontend: Next.js 14 (App Router), Tailwind CSS, Framer Motion (animations), Axios.
Backend: Node.js, Express.js, Socket.IO.
Database: MongoDB (Mongoose ODM).
Authentication: Google OAuth 2.0 (via @react-oauth/google).


Prerequisites
Node.js (v18 or higher)
MongoDB (Local or Atlas)
Google Cloud Console Project (for OAuth Client ID)

# Installation

Clone the repository:
bash
git clone https://github.com/yourusername/buddychat.git

cd buddychat

Install dependencies:

bash

# Install dependencies for both server and client

npm run install:all

# .env files
Backend (
server/.env
) 

**Create a .env**  
**File in the server directory:**  
env  
PORT=5000  
MONGODB_URI=mongodb://localhost:27017/buddychat  
CLIENT_URL=http://localhost:3000  
GOOGLE_CLIENT_ID=your_google_client_id_from_cloud_console  
JWT_SECRET=your_super_secret_jwt_key  

  
Frontend (
client/.env.local
) 
**Create a .env.local**  
**File in the client directory:**  

env  
NEXT_PUBLIC_API_URL=http://localhost:5000  
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000  
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_from_cloud_console  
  
# Running the App
Run both the frontend and backend concurrently with a single command:

bash
npm run dev
Frontend: http://localhost:3000
Backend: http://localhost:5000
