const express = require('express');
const Review = require('./../models/reviewModel');

const {
  getAllReviews,
  getReview,
  createReview,
  updateReview,
} = require('../controllers/reviewController');
const { protect, authorize } = require('./../controllers/authController');

const queryBuilder = require('../middlewares/queryBuilder');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(queryBuilder(Review, { path: 'bootcamp', select: 'name description' }), getAllReviews)
  .post(protect, authorize('user'), createReview);

router.route('/:id').get(getReview).put(protect, authorize('user'), updateReview);

module.exports = router;
