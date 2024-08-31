const express = require('express');
const Review = require('./../models/reviewModel');

const { getAllReviews } = require('../controllers/reviewController');
const queryBuilder = require('../middlewares/queryBuilder');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(queryBuilder(Review, { path: 'bootcamp', select: 'name description' }), getAllReviews);

module.exports = router;
