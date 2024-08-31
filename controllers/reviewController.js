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

// Function to update a review
// Method: PUT /api/v1/reviews/:id
// Access: private
const updateReview = catchAsync(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review) return next(new appError(`No review with the id of ${req.params.id}`));

  if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin')
    return next(new appError(`Not authorized to update review`, 401));

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: review,
  });
});

// Function to delete a review
// Method: DELETE /api/v1/reviews/:id
// Access: private
const deleteReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) return next(new appError(`No review with the id of ${req.params.id}`));

  if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin')
    return next(new appError(`Not authorized to delete review`, 401));

  await Review.findByIdAndDelete(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(204).json({
    success: true,
    data: null,
  });
});

module.exports = {
  getAllReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
};
