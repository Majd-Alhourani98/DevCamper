const express = require('express');
const Review = require('./../models/reviewModel');

const { getAllReviews, getReview } = require('../controllers/reviewController');
const queryBuilder = require('../middlewares/queryBuilder');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(queryBuilder(Review, { path: 'bootcamp', select: 'name description' }), getAllReviews);

router.route('/:id').get(getReview);

module.exports = router;
