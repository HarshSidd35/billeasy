const Book = require("../models/Book");
const Review = require("../models/Review");
const mongoose = require("mongoose");

// POST /api/books - Create a book (authenticated)
const createBook = async (req, res) => {
  try {
    const { title, author, genre, description } = req.body;

    const book = await Book.create({
      title,
      author,
      genre,
      description,
      createdBy: req.user._id,
    });

    res.status(201).json(book);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating book", error: error.message });
  }
};

// GET /api/books - Get all books with optional filters and pagination
const getAllBooks = async (req, res) => {
  try {
    const { page = 1, limit = 10, author, genre } = req.query;

    const filter = {};
    if (author) filter.author = new RegExp(author, "i");
    if (genre) filter.genre = new RegExp(genre, "i");

    const books = await Book.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Book.countDocuments(filter);

    res.json({
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      totalBooks: total,
      books,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching books", error: error.message });
  }
};

// GET /api/books/:id - Get book by ID with avg rating and reviews (paginated)
const getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 5 } = req.query;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid book ID" });
    }

    const book = await Book.findById(id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    const reviews = await Review.find({ book: id })
      .populate("user", "username")
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const totalReviews = await Review.countDocuments({ book: id });

    const avgRatingObj = await Review.aggregate([
      { $match: { book: book._id } },
      { $group: { _id: null, avgRating: { $avg: "$rating" } } },
    ]);

    const avgRating =
      avgRatingObj.length > 0 ? avgRatingObj[0].avgRating : null;

    res.json({
      book,
      averageRating: avgRating,
      reviews: {
        page: Number(page),
        totalPages: Math.ceil(totalReviews / limit),
        totalReviews,
        data: reviews,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching book details", error: error.message });
  }
};

// POST /api/books/:id/reviews - Submit review (auth only, one per user per book)
const addReviewToBook = async (req, res) => {
  console.log("hit");
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid book ID" });
    }

    const book = await Book.findById(id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    // Check for existing review by this user
    const existingReview = await Review.findOne({
      book: id,
      user: req.user._id,
    });
    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this book" });
    }

    const review = await Review.create({
      user: req.user._id,
      book: id,
      rating,
      comment,
    });

    res.status(201).json({ message: "Review added", review });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding review", error: error.message });
  }
};

// GET /api/books/search?query=...
const searchBooks = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({ message: "Query is required" });
    }

    const trimmedQuery = query.trim();

    // Fuzzy match: each word in the query can be anywhere
    const regex = new RegExp(trimmedQuery.split(" ").join(".*"), "i");

    const results = await Book.find({
      $or: [{ title: { $regex: regex } }, { author: { $regex: regex } }],
    }).sort({ createdAt: -1 });

    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: `No books found matching "${query}"` });
    }

    res.status(200).json({ totalResults: results.length, results });
  } catch (error) {
    console.error("Search Error:", error);
    res.status(500).json({
      message: "Error searching books",
      error: error.message,
    });
  }
};

module.exports = {
  createBook,
  getAllBooks,
  getBookById,
  addReviewToBook,
  searchBooks,
};
