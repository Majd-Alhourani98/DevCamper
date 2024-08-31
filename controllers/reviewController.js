// Importing necessary modules and models
const Review = require('./../models/reviewModel'); // Course model
const appError = require('./../utils/appError'); // Custom error handling
const catchAsync = require('./../utils/catchAsync'); // Async error handling utility

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

module.exports = {
  getAllReviews,
};
