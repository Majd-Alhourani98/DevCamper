const express = require('express');
const Review = require('./../models/reviewModel');

<<<<<<< HEAD
const { getAllReviews, getReview, createReview } = require('../controllers/reviewController');
const { protect, authorize } = require('./../controllers/authController');
=======
const { getAllReviews, getReview } = require('../controllers/reviewController');
>>>>>>> ba8d1d1ad7ae5fb8113011113c6bd8ba1653b1bd
const queryBuilder = require('../middlewares/queryBuilder');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(queryBuilder(Review, { path: 'bootcamp', select: 'name description' }), getAllReviews)
  .post(protect, authorize('user'), createReview);

router.route('/:id').get(getReview);

router.route('/:id').get(getReview);

module.exports = router;
