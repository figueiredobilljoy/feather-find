# Feather Find 🪶

Feather Find is a full-stack MERN application (React frontend, Node.js/Express backend) that allows users to upload bird sightings. The app uses the Groq Vision API to automatically identify the bird species from the uploaded image and provides a confidence score and reasoning.

## Prerequisites

- Node.js (v18 or higher recommended)
- A Groq API Key for AI vision identification

## Project Setup

### 1. Backend Setup

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables:
   - Copy the `.env.example` file and rename it to `.env`.
   - Open `.env` and add your `GROQ_API_KEY`.
   - *(Optional)* Change the `JWT_SECRET` for security.
4. Start the backend server:
   ```bash
   npm start
   ```
   *There is no explicit `start` script in `package.json` — this works because npm defaults to `node server.js` when no start script is defined. The backend will automatically create the required SQLite database (`feather_find.db`) on the first run. The server runs on `http://localhost:3000`.*

### 2. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```
   *The Vite development server typically runs on `http://localhost:5173`. Open this URL in your browser to view the application.*

## Features

- **User Authentication:** Register and log in using JWT-based authentication.
- **AI Bird Identification:** Upload an image of a bird, and the AI will identify the species, provide its scientific name, and offer reasoning.
- **Sighting Directory:** Browse a feed of community-approved bird sightings.
- **Admin Dashboard:** A dedicated `/admin` route for moderating (approving/rejecting) user-submitted sightings and viewing platform statistics.

## Default Admin Account

If you start the backend on a fresh database, a default admin account is automatically created for you:
- **Email:** `admin@featherfind.local`
- **Password:** `admin123`

Log in with this account to access the Admin dashboard and moderate submissions.
