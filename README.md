# Tournament Intelligence Platform

## Project Idea

Tournament organizers collect match results and performance statistics, but these records are not always analyzed across players, teams, and seasons. The Tournament Intelligence Platform is a MERN-based application designed to help organizers manage tournament data and analyze long-term performance trends.

## Day-by-Day Plan

### Day 1
Set up the GitHub repository and project documentation.

### Day 2
Analyze requirements and design the database structure.

### Day 3
Set up the Node.js and Express backend.

### Day 4
Connect the database and implement core APIs.

### Day 5
Set up the React frontend and create the main application screens.

### Day 6
Connect the frontend with backend APIs.

### Day 7
Implement tournament, team, player, and match management.

### Day 8
Implement performance analytics and season-wise comparisons.

### Day 9
Test the application, fix bugs, and improve the user experience.

### Day 10
Complete documentation, testing, and project demonstration.

## Google Authentication Setup

The client uses Google Identity Services to sign in, and the server verifies the
Google ID token before creating an HTTP-only session cookie.

1. Create a Google OAuth 2.0 **Web application** client ID in Google Cloud
   Console. Add `http://localhost:5173` as an authorized JavaScript origin.
2. Copy `client/.env.example` to `client/.env` and set
   `VITE_GOOGLE_CLIENT_ID` to that client ID. Set `VITE_API_URL` if the API is
   not running at `http://localhost:5000`.
3. Copy `server/.env.example` to `server/.env`. Set the same
   `GOOGLE_CLIENT_ID`, a random `AUTH_SESSION_SECRET` of at least 32 characters,
   and `CLIENT_ORIGIN` to the exact client origin. Configure `MONGO_URI` as
   required by the existing server startup.
4. Run the server and client in separate terminals with `npm start` in
   `server/` and `npm run dev` in `client/`.

The session cookie is HTTP-only, uses `SameSite=Lax`, and is marked secure in
production. Use HTTPS and configure the production origins before deployment.