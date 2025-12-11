# Deployment Guide

This guide covers how to deploy BuddyChat. We will use:
1.  **MongoDB Atlas** for the database.
2.  **Render** for the Node.js/Express Backend (supports WebSockets).
3.  **Vercel** for the Next.js Frontend.

---

## 1. Database (MongoDB Atlas)

1.  Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up/login.
2.  Create a new **Cluster** (the free Shared tier is fine).
3.  **Database Access**: Create a database user (username/password). **Remember these!**
4.  **Network Access**: specific "Allow Access from Anywhere" (0.0.0.0/0).
5.  **Connect**: Click "Connect" -> "Drivers" -> Copy the **Connection String**.
    *   It looks like: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority`
    *   Replace `<password>` with your actual password.

---

## 2. Backend (Render)

1.  Push your code to **GitHub** (if you haven't already).
2.  Go to [Render](https://render.com) and sign up.
3.  Click **New +** -> **Web Service**.
4.  Connect your GitHub repository.
5.  **Settings**:
    *   **Root Directory**: `server` (Important!)
    *   **Build Command**: `npm install`
    *   **Start Command**: `node index.js`
6.  **Environment Variables**:
    *   `MONGODB_URI`: Paste your connection string from Step 1.
    *   `JWT_SECRET`: Any random long string (e.g., `supersecretkey123`).
    *   `CLIENT_URL`: We will update this later with your Vercel URL, but for now, you can put `*`.
    *   `GOOGLE_CLIENT_ID`: Your Google client ID.
7.  Click **Create Web Service**.
8.  Once deployed, copy the **Service URL** (e.g., `https://buddychat-backend.onrender.com`).

---

## 3. Frontend (Vercel)

1.  Go to [Vercel](https://vercel.com) and sign up.
2.  Click **Add New...** -> **Project**.
3.  Import your GitHub repository.
4.  **Settings**:
    *   **Root Directory**: Click "Edit" and select `client`.
    *   **Framework Preset**: Next.js (should be auto-detected).
5.  **Environment Variables**:
    *   `NEXT_PUBLIC_API_URL`: Your Render Backend URL (e.g., `https://buddychat-backend.onrender.com`).
    *   `NEXT_PUBLIC_SOCKET_URL`: Same as above (e.g., `https://buddychat-backend.onrender.com`).
    *   `NEXT_PUBLIC_GOOGLE_CLIENT_ID`: Your Google Client ID.
6.  Click **Deploy**.

---

## 4. Final Configuration

1.  **Update Google Cloud Console**:
    *   Go to your [Google Cloud Console](https://console.cloud.google.com/).
    *   Add your **Vercel domain** (e.g., `https://buddychat.vercel.app`) to "Authorized JavaScript origins".
    *   Add `https://buddychat.vercel.app` (and `.../login` usually not needed for client-side flow but good to separate) to authorized origins.

2.  **Update Backend CLIENT_URL**:
    *   Go back to **Render** -> Dashboard -> Environment Variables.
    *   Update `CLIENT_URL` to your specific Vercel domain (e.g., `https://buddychat.vercel.app`) to strictly allow CORS from your app.

**Done!** Your app is now live.
