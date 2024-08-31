// Importing necessary modules and models
const Review = require('./../models/reviewModel'); // Course model
const appError = require('./../utils/appError'); // Custom error handling
const catchAsync = require('./../utils/catchAsync'); // Async error handling utility
const Bootcamp = require('./../models/bootcampModel');
// Function to get all reviews
// Method: GET /api/v1/reviews or /api/v1/bootcamps/:bootcampId/reviews
// Access: Public
const getAllReviews = catchAsync(async (req, res, next) => {
  console.log('FUCK ME');
  if (req.params.bootcampId) {
    const reviews = await Review.find({ bootcamp: req.params.bootcampId });

    return res.status(200).json({
      success: true,
      result: reviews.length,
      data: { reviews },
    });
  }

  return res.status(200).json(res.response);
});

// Function to get single review
// Method: GET /api/v1/reviews/:id
// Access: Public
const getReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description',
  });

  if (!review) return next(new appError(`No Review found with the id of ${req.params.id}`, 404));

  res.status(200).json({
    success: true,
    data: { review },
  });
});

// Function to create a review
// Method: POST /api/v1/bootcamps/:id/reviews
// Access: private
const createReview = catchAsync(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user._id;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);
  if (!bootcamp) return next(new appError(`No bootcamp with the id of ${req.params.bootcampId}`));

  const review = await Review.create(req.body);

  res.status(201).json({
    success: true,
    data: review,
  });
});

module.exports = {
  getAllReviews,
  getReview,
  createReview,
};
