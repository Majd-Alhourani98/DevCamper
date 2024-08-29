const Course = require('./../models/CourseModel');

const appError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

// description: GET all courses
// route:       GET /api/v1/courses
// route:       Get /api/v1/bootcamps/:bootcampId/courses
// access       Public
const getAllCourses = catchAsync(async (req, res, next) => {
  let query;

  if (req.params.bootcampId) {
    query = await Course.find({ bootcamp: req.params.bootcampId });
  } else {
    query = Course.find().populate({
      path: 'bootcamp',
      select: 'name description',
    });
  }

  const courses = await query;

  res.status(200).json({
    status: true,
    result: courses.length,
    data: {
      courses,
    },
  });
});

const getSingle = catchAsync((req, res, next) => {});

module.exports = {
  getAllCourses,
};
