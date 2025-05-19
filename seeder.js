const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const db = require("./config/db");

const User = require("./models/User");
const Book = require("./models/Book");
const Review = require("./models/Review");

dotenv.config();
db(); // Connect to DB

const seed = async () => {
  try {
    // Cleanup
    await User.deleteMany();
    await Book.deleteMany();
    await Review.deleteMany();

    console.log("🧹 Cleared existing data");

    // Seed Users
    const hashedPassword = await bcrypt.hash("password123", 10);
    const users = await User.insertMany([
      {
        username: "alice",
        email: "alice@example.com",
        password: hashedPassword,
      },
      { username: "bob", email: "bob@example.com", password: hashedPassword },
      {
        username: "charlie",
        email: "charlie@example.com",
        password: hashedPassword,
      },
    ]);
    console.log("👤 Users seeded");

    // Seed Books
    const books = await Book.insertMany([
      {
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        genre: "Classic",
        description: "A story of the Roaring Twenties.",
        createdBy: users[0]._id,
      },
      {
        title: "1984",
        author: "George Orwell",
        genre: "Dystopian",
        description: "A depiction of a totalitarian future.",
        createdBy: users[1]._id,
      },
      {
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        genre: "Fiction",
        description: "A young girl confronts racism in the Deep South.",
        createdBy: users[1]._id,
      },
      {
        title: "Sapiens: A Brief History of Humankind",
        author: "Yuval Noah Harari",
        genre: "Non-fiction",
        description: "A narrative of human history and evolution.",
        createdBy: users[2]._id,
      },
      {
        title: "The Alchemist",
        author: "Paulo Coelho",
        genre: "Adventure",
        description: "A journey of finding one’s personal legend.",
        createdBy: users[2]._id,
      },
    ]);
    console.log("📚 Books seeded");

    // Seed Reviews
    const reviews = await Review.insertMany([
      {
        user: users[0]._id,
        book: books[1]._id,
        rating: 5,
        comment: "A haunting and powerful novel.",
      },
      {
        user: users[1]._id,
        book: books[0]._id,
        rating: 4,
        comment: "Timeless classic with vivid imagery.",
      },
      {
        user: users[2]._id,
        book: books[0]._id,
        rating: 5,
        comment: "Loved the symbolism and writing style.",
      },
      {
        user: users[0]._id,
        book: books[2]._id,
        rating: 4,
        comment: "Deeply moving and thought-provoking.",
      },
      {
        user: users[1]._id,
        book: books[3]._id,
        rating: 5,
        comment: "An insightful look into human history.",
      },
      {
        user: users[2]._id,
        book: books[4]._id,
        rating: 3,
        comment: "Simple story but a strong message.",
      },
      {
        user: users[1]._id,
        book: books[4]._id,
        rating: 4,
        comment: "Inspirational and poetic.",
      },
      {
        user: users[0]._id,
        book: books[3]._id,
        rating: 4,
        comment: "Very informative and well-written.",
      },
    ]);
    console.log("📝 Reviews seeded");

    console.log("✅ Database seeding complete!");
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding data:", err);
    process.exit(1);
  }
};

seed();
