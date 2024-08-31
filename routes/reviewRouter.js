const express = require('express');
const Review = require('./../models/reviewModel');

const { getAllReviews, getReview, createReview } = require('../controllers/reviewController');
const { protect, authorize } = require('./../controllers/authController');

const queryBuilder = require('../middlewares/queryBuilder');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(queryBuilder(Review, { path: 'bootcamp', select: 'name description' }), getAllReviews)
  .post(protect, authorize('user'), createReview);

router.route('/:id').get(getReview);

router.route('/:id').get(getReview);

module.exports = router;
