# 📚 Book Review API

A RESTful API built with **Node.js**, **Express**, **MongoDB**, and **JWT Authentication** that allows users to sign up, log in, add books, write reviews, and search for books.

---

## 🚀 Features

- User authentication with JWT
- CRUD operations for books and reviews
- One review per user per book
- Average rating calculation
- Search by title or author (case-insensitive, partial match)
- Pagination and filtering
- Clean and modular codebase

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JWT
- **Other Tools**: bcryptjs, dotenv

---

## 📦 Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/book-review-api.git
cd book-review-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env` file

Create a `.env` file in the root and add the following environment variables:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/bookreview
JWT_SECRET=your_jwt_secret_key
```

### 4. Run the development server

```bash
node server.js
# or
npm start
```

---

## 🧪 Seeding the Database (Optional)

To populate the database with demo users, books, and reviews, run:

```bash
node seeder.js
```

---

## 📬 API Endpoints

### 🔐 Auth Routes

| Method | Endpoint           | Description             |
| ------ | ------------------ | ----------------------- |
| POST   | `/api/auth/signup` | Register a new user     |
| POST   | `/api/auth/login`  | Login and get JWT token |

### 📚 Book Routes

| Method | Endpoint                      | Description                                         |
| ------ | ----------------------------- | --------------------------------------------------- |
| GET    | `/api/books`                  | Get all books with optional filters and pagination  |
| GET    | `/api/books/:id`              | Get a book by ID including average rating & reviews |
| POST   | `/api/books`                  | Add a new book (Authentication required)            |
| GET    | `/api/books/search?query=...` | Search books by title or author                     |

### 📝 Review Routes

| Method | Endpoint                     | Description                         |
| ------ | ---------------------------- | ----------------------------------- |
| POST   | `/api/books/:bookId/reviews` | Submit a review (one per user/book) |
| PUT    | `/api/reviews/:reviewId`     | Update your review                  |
| DELETE | `/api/reviews/:reviewId`     | Delete your review                  |

---

## ✅ Example Requests

### Signup

```bash
curl -X POST http://localhost:5000/api/auth/signup -H "Content-Type: application/json" -d '{"name":"John", "email":"john@example.com", "password":"123456"}'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d '{"email":"john@example.com", "password":"123456"}'
```

### Add a Book

```bash
curl -X POST http://localhost:5000/api/books -H "Authorization: Bearer <your_token>" -H "Content-Type: application/json" -d '{"title":"Book Title", "author":"Author Name", "genre":"Fiction"}'
```

---

## 🧠 Assumptions & Design Notes

- Each user can submit only **one review per book**
- Searching is **case-insensitive** and supports **partial matches**
- Only review **owners can edit/delete** their reviews
- Book addition is **restricted to authenticated users**

---

## 🗄️ Database Schema

### Users

| Field     | Type     | Description           |
| --------- | -------- | --------------------- |
| \_id      | ObjectId | Unique identifier     |
| name      | String   | User's name           |
| email     | String   | User's email (unique) |
| password  | String   | Hashed password       |
| createdAt | Date     | Creation timestamp    |

### Books

| Field     | Type     | Description        |
| --------- | -------- | ------------------ |
| \_id      | ObjectId | Unique identifier  |
| title     | String   | Book title         |
| author    | String   | Author of the book |
| genre     | String   | Genre of the book  |
| createdAt | Date     | Creation timestamp |

### Reviews

| Field     | Type     | Description                   |
| --------- | -------- | ----------------------------- |
| \_id      | ObjectId | Unique identifier             |
| user      | ObjectId | Reference to `User`           |
| book      | ObjectId | Reference to `Book`           |
| rating    | Number   | Rating given by user (1 to 5) |
| comment   | String   | Review text                   |
| createdAt | Date     | Creation timestamp            |

- Each **review** is linked to both a **user** and a **book**
- A **user** can submit **only one review per book**
