# GDG Peer Learning Platform - Backend Architecture

## Overview
This backend powers the GDG Peer Learning full-stack application. Built with Node.js and Express, it provides secure authentication, real-time collaboration via WebSockets/WebRTC, and a comprehensive REST API for gamification (coins, bounties) and matchmaking.

## Core Technologies & Packages
- **Express.js**: REST API framework.
- **Mongoose / MongoDB**: NoSQL database for flexible document schemas.
- **bcryptjs**: Used for securely hashing user passwords before storing them in the database.
- **jsonwebtoken (JWT)**: Generates secure access tokens to verify user identity without maintaining server-side session state.
- **cookie-parser**: Parses HTTP-only cookies containing JWTs, preventing XSS attacks from accessing the tokens via `document.cookie`.
- **Socket.io**: Enables real-time, bi-directional event emission. Crucial for live syncing Monaco Editor (`@monaco-editor/react`) code changes, Whiteboard events, and WebRTC signaling (offers, answers, ICE candidates).
- **Firebase / Google OAuth**: Used for validating 1-Click Sign-In via Google.

## Security Architecture
### Authentication Flow
We use a unified dual-auth system:
1. **Manual Form**: Requires Name, Email, Password, etc. Passwords are never stored in plaintext; they are hashed via `bcryptjs`.
2. **Google 1-Click Sign-In**: Uses Firebase on the frontend to retrieve a Google profile, which is sent to the backend to instantly register or log in the user, auto-generating a secure random password if they are new.

### HTTP-Only JWT Cookies vs LocalStorage
For maximum security, this application explicitly avoids storing sensitive auth tokens in `localStorage`. 
- **The Problem with LocalStorage**: Any malicious JavaScript running on the client can read `localStorage`, making it highly vulnerable to Cross-Site Scripting (XSS).
- **The Solution (HTTP-Only Cookies)**: Upon successful login, the server sets a `jwt` cookie with the `httpOnly: true` flag. This prevents client-side JS from accessing it. The browser automatically attaches this cookie to subsequent API requests (if `credentials: 'include'` is set), keeping auth completely secure from XSS.

## Database Schemas

### User Schema (`User.js`)
- `name` (String, required)
- `email` (String, required, unique)
- `password` (String, required, hashed)
- `role` (Enum: Student, Mentor, Admin)
- `gdgCoins` (Number, default: 100) - For the Gamification Economy.
- Academic fields: `enrollmentNumber`, `branch`, `semester`.

### Bounty Schema (`Bounty.js`)
- `title`, `description`, `coins` (Number, reward amount)
- `author` (ObjectId, ref: User)
- `status` (Enum: Open, Solved)
- `solver` (ObjectId, ref: User)

## Core Systems
1. **Real-time Collaboration (`/session/:id`)**: Uses Socket.io to sync live code diffs and handle WebRTC peer-to-peer video/audio connections.
2. **Gamification & Coins**: Users receive a 100-coin bonus on registration. They can spend coins to post doubt Bounties, and earn coins by solving Bounties for peers.
3. **Smart Matchmaking**: The frontend dynamically searches and filters peers based on skills taught vs skills wanted.
