# 🚀 Oriental Insurance Virtual Office - Real Authentication System

## 🔧 Setup Instructions

### 1. Start Both Servers

Run the batch file to start both backend and frontend servers:

```
start-servers.bat
```

Or manually start them:

```bash
# Terminal 1 - Backend (Port 5000)
cd backend
npm start

# Terminal 2 - Frontend (Port 3001)
cd frontend
node simple-server.js
```

### 2. Test the Application

- Open browser: http://localhost:3001
- Click the office door
- Use the real authentication system

## 🔐 Authentication Features

### ✅ Real Account Creation

- **Signup**: Creates actual user accounts with hashed passwords
- **Validation**: Email format, password strength, required fields
- **Storage**: Users stored in `backend/data/users.json` (will be created automatically)
- **Security**: Passwords hashed with bcrypt, JWT tokens for sessions

### ✅ Real Login System

- **Authentication**: Verifies credentials against stored users
- **Session Management**: JWT tokens stored in localStorage
- **Error Handling**: Proper error messages for invalid credentials
- **Security**: Protected routes and secure password comparison

### ✅ Backend API Endpoints

- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (requires token)
- `GET /api/health` - API health check

## 🧪 Testing the System

### Test Account Creation:

1. Click the office door
2. Switch to "Sign Up" tab
3. Fill in all fields:
   - Name: Your Name
   - Email: test@example.com
   - Phone: 1234567890
   - Password: password123
   - Confirm Password: password123
4. Click "Create Account & Access Office"
5. Account will be created and you'll be logged in automatically

### Test Login:

1. Click the office door
2. Use "Login" tab with the credentials you just created
3. You'll be authenticated and granted office access

### Verify Real Storage:

- Check `backend/data/users.json` to see your account was really created
- Passwords are properly hashed for security
- User data includes timestamps and unique IDs

## 🔍 Technical Details

### Frontend Changes:

- Real API calls instead of simulated authentication
- Proper error handling for backend connectivity
- JWT token storage and management
- API proxy for backend communication

### Backend Features:

- Express.js server with authentication routes
- Password hashing with bcryptjs
- JWT token generation and verification
- Input validation and sanitization
- CORS support for frontend requests
- File-based user storage (easily upgradable to database)

### Security Features:

- Passwords hashed with salt
- JWT tokens with expiration
- Input validation and sanitization
- CORS protection
- Rate limiting on API endpoints
- Secure headers with Helmet.js

## 🚀 Ready to Test!

The system now creates real user accounts that persist between sessions. Users can sign up once and login multiple times with their credentials.

The door authentication is now a fully functional registration and login system! 🎉
