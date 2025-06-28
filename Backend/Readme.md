# CodeMaze Backend API Documentation 🚀

<div align="center">
  <h3>RESTful API for Algorithm Visualization Platform</h3>
</div>

## 🛠 Tech Stack

- Node.js
- Express.js
- MongoDB
- JWT Authentication
- bcrypt
- cookie-parser

## 🔧 Installation

1. **Clone the repository and install dependencies**

```bash
git clone https://github.com/yourusername/codemaze.git
cd codemaze/backend
npm install
```

2. **Environment Setup**

```bash
# Create .env file
touch .env

# Add these variables to .env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/codemaze
JWT_SECRET=your_jwt_secret_key
```

## 🚀 API Routes

### Authentication Routes

#### 1. Register User

```http
POST /users/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response**

```json
{
  "user": {
    "name": "John Doe",
    "email": "john@example.com",
    "_id": "user_id"
  },
  "token": "jwt_token"
}
```

#### 2. Login User

```http
POST /users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123",
  "rememberMe": true
}
```

**Response**

```json
{
  "user": {
    "name": "John Doe",
    "email": "john@example.com",
    "_id": "user_id"
  },
  "token": "jwt_token"
}
```

## 💾 Database Schema

### User Model

```javascript
{
  name: String,       // Required
  email: String,      // Required
  password: String,   // Required, Hashed
  remember: Boolean   // Default: false
}
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

- Tokens are generated upon successful login/register
- Tokens expire after 24 hours
- Tokens are stored in cookies for secure client-side storage

## 🔒 Security Features

1. **Password Hashing**

   - Passwords are hashed using bcrypt
   - Salt rounds: 10

2. **JWT Authentication**

   - Tokens expire after 24 hours
   - Secure cookie storage

3. **Request Validation**
   - Input validation for all routes
   - Error handling middleware

## 🚦 API Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `404`: Not Found
- `500`: Server Error

## 🔍 Error Handling

The API returns errors in the following format:

```json
{
  "message": "Error message here"
}
```

## 🏃‍♂️ Running the Server

**Development Mode**

```bash
npm run dev
```

**Production Mode**

```bash
npm start
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📝 API Endpoints Overview

| Method | Endpoint        | Description       | Auth Required |
| ------ | --------------- | ----------------- | ------------- |
| POST   | /users/register | Register new user | No            |
| POST   | /users/login    | Login user        | No            |
| GET    | /users/profile  | Get user profile  | Yes           |

## 🔄 Environment Variables

| Variable    | Description               | Required |
| ----------- | ------------------------- | -------- |
| PORT        | Server port               | Yes      |
| MONGODB_URI | MongoDB connection string | Yes      |
| JWT_SECRET  | JWT signing secret        | Yes      |

## 📦 Dependencies

- `express`: ^4.17.1
- `mongoose`: ^6.0.0
- `jsonwebtoken`: ^8.5.1
- `bcrypt`: ^5.0.1
- `cookie-parser`: ^1.4.6
- `cors`: ^2.8.5
- `dotenv`: ^10.0.0

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

<div align="center">
  Made with ❤️ by the CodeMaze Team
</div>
