const express = require("express");
const router = express.Router();
const {
  createBook,
  getAllBooks,
  getBookById,
  addReviewToBook,
  searchBooks,
} = require("../controllers/bookController");

const protect = require("../middlewares/protect");

// GET /api/books/search?query=xyz - Search books by title or author
router.get("/search", searchBooks); // You can move this to its own route group if needed

// POST /api/books - Add a new book (authenticated)
router.post("/", protect, createBook);

// GET /api/books - Get all books with optional filters and pagination
router.get("/", getAllBooks);

// GET /api/books/:id - Get book by ID with avg rating and reviews
router.get("/:id", getBookById);

// POST /api/books/:id/reviews - Add review (authenticated, one per user per book)
router.post("/:id/reviews", protect, addReviewToBook);

module.exports = router;
