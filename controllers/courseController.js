const Course = require('./../models/CourseModel');
const Bootcamp = require('./../models/bootcampModel');

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

// description: GET Single Course
// route:       GET /api/v1/courses/:id
// access       Public
const getSingleCourse = catchAsync(async (req, res, next) => {
  const { id } = req.params.id;
  const course = await Course.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description',
  });

  if (!course)
    return next(new appError(`No course with the id of ${req.params.id}`, 404));

  res.status(200).json({
    status: true,
    data: { course },
  });
});

// description: Add Course
// route:       POST /api/v1/bootcamps/:bootcampId/courses
// access       Private
const createCourse = catchAsync(async (req, res, next) => {
  const { bootcampId } = req.params;
  console.log(bootcampId);

  // Check if the bootcamp exist in the database
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp)
    return next(new appError(`No bootcamp with the id of ${bootcampId}`));

  req.body.bootcamp = bootcampId;

  const course = await Course.create(req.body);

  res.status(200).json({
    success: true,
    data: { course },
  });
});

module.exports = {
  getAllCourses,
  getSingleCourse,
  createCourse,
};
