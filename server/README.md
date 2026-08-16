# Security Measures Implementation

## Overview
This document outlines the security measures implemented for the Authentication and Authorization system in the GDG Peer Learning full-stack MERN application.

## Technologies Used

### 1. `bcryptjs`
- **Purpose**: Used for hashing user passwords before storing them in the database.
- **Why it was chosen**: Storing passwords in plain text is a critical security vulnerability. If the database is compromised, attackers can easily view user passwords. `bcryptjs` uses a salt and a hashing algorithm to encrypt the password, making it computationally expensive and resistant to brute-force and dictionary attacks. We use 10 salt rounds to provide a good balance between security and performance.

### 2. `jsonwebtoken` (JWT)
- **Purpose**: Used for securely transmitting information between the client and the server as a JSON object, specifically for authorization.
- **Why it was chosen**: JWT is stateless, meaning the server doesn't need to store session data in the database, reducing database load. The token is signed using a secret key, ensuring that it hasn't been tampered with. The token includes the user's ID and role, allowing the server to quickly authorize protected route access.

### 3. `cookie-parser`
- **Purpose**: Used to parse cookies attached to the client request object.
- **Why it was chosen**: It allows the Express server to easily read the HTTP-only cookies where the JWT is stored, which is required for our `isAuth` middleware to function properly.

## Implementation Details

### HTTP-Only Cookies vs. LocalStorage
We store the JWT in an **HTTP-only, secure, and SameSite** cookie rather than LocalStorage. 
- **XSS Protection**: LocalStorage is accessible via JavaScript. If our application has a Cross-Site Scripting (XSS) vulnerability, an attacker can steal the token from LocalStorage. HTTP-only cookies cannot be accessed via JavaScript, providing strong protection against XSS token theft.
- **CSRF Protection**: By setting the cookie attribute `sameSite: 'strict'`, we instruct the browser to only send the cookie with requests originating from the same site. This prevents Cross-Site Request Forgery (CSRF) attacks.
- **Secure Flag**: In production, the cookie is marked as `secure`, ensuring it is only transmitted over encrypted HTTPS connections.

### Middleware

1. **`isAuth` (Authentication)**: This middleware intercepts requests to protected endpoints. It extracts the JWT from the HTTP-only cookie, verifies its signature using the secret key, and attaches the decoded user payload to `req.user`. If the token is missing or invalid, it rejects the request with a 401 Unauthorized status.
2. **`hasRole` (Authorization)**: This middleware is used alongside `isAuth` to restrict endpoints to specific user roles (e.g., 'Admin', 'Mentor'). It checks the `role` property on `req.user` against an array of allowed roles.

### Frontend Security
- The React frontend uses a Context API (`AuthContext`) to manage the global authentication state without directly accessing the token.
- Protected routes are guarded by a `ProtectedRoute` component that checks the `AuthContext`. If the user is unauthenticated, they are seamlessly redirected to the `/login` page.
- Forms include client-side validation (e.g., password length checks) before sending data to the server to reduce unnecessary backend load and improve user experience.
