const express = require("express");
const router = express.Router();
const {
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");
const protect = require("../middlewares/protect");

// PUT /api/reviews/:id - Update own review
router.put("/:id", protect, updateReview);

// DELETE /api/reviews/:id - Delete own review
router.delete("/:id", protect, deleteReview);

module.exports = router;
