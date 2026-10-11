# 🏦 Backend Ledger System

A banking backend application built with **Node.js, Express.js, and MongoDB** that allows users to register, create bank accounts, manage their balances, and transfer money between accounts. The project follows a modular backend architecture with dedicated routes, controllers, models, middleware, and services.

## 🚀 Features

- **User Authentication** – User registration and login.
- **Account Management** – Create and manage bank accounts.
- **Money Transfers** – Transfer money between accounts.
- **Transaction History** – Store and track financial transactions.
- **JWT Authentication** – Secure authentication using JSON Web Tokens.
- **Protected Routes** – Middleware to authenticate users before granting access to protected endpoints.
- **Logout Functionality** – Blacklist authentication tokens to prevent their reuse after logout.
- **Email Service** – Email service integration for application notifications.

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Backend Framework:** Express.js
- **Database:** MongoDB
- **ODM:** Mongoose
- **Authentication:** JSON Web Tokens (JWT)
- **Email:** Nodemailer
- **API Style:** REST API

## 📁 Project Structure

```text
Backend-Ledger/
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── account.controller.js
│   │   ├── auth.controller.js
│   │   └── transaction.controller.js
│   ├── middleware/
│   │   └── auth.middleware.js
│   ├── models/
│   │   ├── account.model.js
│   │   ├── blackList.model.js
│   │   ├── ledger.model.js
│   │   ├── transaction.model.js
│   │   └── user.model.js
│   ├── routes/
│   │   ├── account.routes.js
│   │   ├── auth.routes.js
│   │   └── transaction.routes.js
│   ├── services/
│   │   └── email.service.js
│   └── app.js
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── server.js
└── README.md
```

## ⚙️ Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/Backend-Ledger.git
cd Backend-Ledger
```

Replace `YOUR_USERNAME` with your GitHub username.

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root and configure the environment variables required by your application.

Example:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Add any additional environment variables required for your email service and authentication configuration.

**Important:** Never commit your `.env` file or expose database credentials, JWT secrets, or email credentials publicly.

### 4. Start the Server

Use the command configured for your project in `package.json`. If your entry point is `server.js`, you can run:

```bash
node server.js
```

The server will start on the configured port.

## 🔐 Security Considerations

- Authentication is handled using JWTs.
- Protected routes use authentication middleware.
- Logged-out tokens can be invalidated through a token blacklist.
- Environment variables are used to store sensitive configuration.

For production use, financial transactions should also implement database transactions, proper balance validation, authorization checks, and safeguards against concurrent transfers.

## 🔮 Future Improvements

- Add comprehensive input validation.
- Implement atomic money transfers using MongoDB transactions.
- Add account balance and transaction pagination endpoints.
- Improve error handling and API response consistency.
- Add automated unit and integration tests.
- Introduce API documentation using Swagger.
- Add rate limiting and enhanced security measures.

## 👨‍💻 Author

**Vardaan Chitranshi**

GitHub: [VC-17](https://github.com/VC-17)

---


## 🌐 Live Deployment

**Backend API:** [https://backend-ledger-ih0v.onrender.com](https://backend-ledger-ih0v.onrender.com/)

The backend is deployed on Render. You can test the API using the appropriate endpoints with Postman or another API client.



⭐ If you find this project interesting, consider giving the repository a star!