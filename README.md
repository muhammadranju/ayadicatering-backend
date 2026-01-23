# 🧑‍🍳 Ayadi Catering Backend

A robust and scalable backend API for the **Ayadi Catering** platform — built with **TypeScript**, **Node.js**, **Express**, and **Mongoose**. This backend provides secure authentication, file uploads, email delivery, logging, and data validation to support the catering application.

---

## 🛠️ Features

- 🔐 **Authentication System**  
  JWT-based authentication with bcrypt password hashing.

- 📁 **File Upload Support**  
  Efficient file handling using Multer.

- 📬 **Email Service**  
  Supports email sending using NodeMailer.

- 📊 **Data Validation**  
  Uses Zod and Mongoose for strong schema validation.

- 🧹 **Code Quality Tools**  
  ESLint and Prettier ensure consistent and maintainable code.

- 📝 **Request & Error Logging**  
  Logs via Winston and daily rotating files, plus HTTP request logging with Morgan.

---

## 🚀 Tech Stack

| Category       | Technology         |
| -------------- | ------------------ |
| Language       | TypeScript         |
| Runtime        | Node.js            |
| Framework      | Express            |
| ORM/Database   | Mongoose (MongoDB) |
| Authentication | JWT & bcrypt       |
| Email          | NodeMailer         |
| File Upload    | Multer             |
| Logging        | Winston & Morgan   |
| Code Quality   | ESLint, Prettier   |

---

## 📦 Getting Started

Follow these steps to run the project locally:

### 🔧 1. Clone the repository

```bash
git clone https://github.com/muhammadranju/ayadicatering-backend.git
cd ayadicatering-backend
```

### 📥 2. Install dependencies

```bash
bun install
```

or with bun:

```bash
bun install
```

### 📄 3. Create `.env` file

In the root of the project, add a `.env` file and configure:

```
NODE_ENV=development
PORT=5000
DATABASE_URL=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
EMAIL_HOST=<smtp_host>
EMAIL_PORT=<smtp_port>
EMAIL_USER=<email_user>
EMAIL_PASS=<email_password>
```

Replace values with your actual configuration.

### ▶️ 4. Run the backend

**Development mode:**

```bash
bun run dev
```

**Production mode:**

```bash
bun start
```

---

## 🧪 Development & Testing

You can add automated tests using your preferred testing tools (e.g., Jest or Mocha). Detail test commands here once implemented.

---

## 📍 Project Structure

- `/src` – Main source code
- `/src/controllers` – HTTP request handlers
- `/src/models` – Mongoose models and schemas
- `/src/routes` – Express route handlers
- `/src/middleware` – Middleware functions
- `/src/utils` – Logging, validation, helpers

---

## 🧩 API Overview

This backend exposes RESTful endpoints — e.g.,

| Endpoint         | Method | Description         |
| ---------------- | ------ | ------------------- |
| `/auth/register` | POST   | Register a new user |
| `/auth/login`    | POST   | Authenticate user   |
| `/upload`        | POST   | Upload file         |
| `/email/send`    | POST   | Send email          |

> Provide full API documentation (Swagger or Postman) here if available.

---

## 💬 Contact

For questions or support, reach out via GitHub Issues or email.
