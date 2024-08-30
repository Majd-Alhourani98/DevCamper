// Importing necessary modules and models
const Course = require('./../models/CourseModel'); // Course model
const Bootcamp = require('./../models/bootcampModel'); // Bootcamp model
const appError = require('./../utils/appError'); // Custom error handling
const catchAsync = require('./../utils/catchAsync'); // Async error handling utility

// Function to get all courses or courses by bootcamp ID
// Method: GET /api/v1/courses or /api/v1/bootcamps/:bootcampId/courses
// Access: Public
const getAllCourses = catchAsync(async (req, res, next) => {
  let query;

  // Check if bootcampId is provided in the request params
  if (req.params.bootcampId) {
    // Get courses for the specific bootcamp
    query = Course.find({ bootcamp: req.params.bootcampId });
  } else {
    // Get all courses and populate bootcamp information
    query = Course.find().populate({
      path: 'bootcamp', // Populate bootcamp field
      select: 'name description', // Select fields to display
    });
  }

  const courses = await query; // Execute the query to get the courses

  // Send response with the fetched courses
  res.status(200).json({
    status: true,
    result: courses.length,
    data: {
      courses,
    },
  });
});

// Function to get a single course by ID
// Method: GET /api/v1/courses/:id
// Access: Public
const getSingleCourse = catchAsync(async (req, res, next) => {
  const { id } = req.params; // Extract course ID from request params
  const course = await Course.findById(id).populate({
    path: 'bootcamp', // Populate bootcamp field
    select: 'name description', // Select fields to display
  });

  // If course not found, return an error
  if (!course)
    return next(new appError(`No course found with the ID of ${id}`, 404));

  // Send response with the fetched course
  res.status(200).json({
    status: true,
    data: { course },
  });
});

// Function to add a new course to a bootcamp
// Method: POST /api/v1/bootcamps/:bootcampId/courses
// Access: Private
const createCourse = catchAsync(async (req, res, next) => {
  const { bootcampId } = req.params; // Extract bootcamp ID from request params

  // Check if the bootcamp exists in the database
  const bootcamp = await Bootcamp.findById(bootcampId);

  // If bootcamp not found, return an error
  if (!bootcamp)
    return next(
      new appError(`No bootcamp found with the ID of ${bootcampId}`, 404)
    );

  req.body.bootcamp = bootcampId; // Set bootcamp ID in the course data

  const course = await Course.create(req.body); // Create a new course

  // Send response with the created course
  res.status(200).json({
    success: true,
    data: { course },
  });
});

// Function to Update a course by ID
// Method: put  /api/v1/courses/:id
// Access: Private
const updateCourse = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  console.log(id);
  let course = await Course.findById(id);

  if (!course)
    return next(
      new appError(`There is No course with the id of ${req.params.id}`)
    );

  course = await Course.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: { course },
  });
});

// Function to Delete a course by ID
// Method: delete /api/v1/courses/:id
// Access: Private

const deleteCourse = catchAsync(async (req, res, next) => {
  const course = await Course.findByIdAndDelete(req.params.id);

  if (!course)
    return next(
      new appError(`There is No course with the id of ${req.params.id}`)
    );

  res.status(204).json({
    success: true,
    data: null,
  });
});

// Export all functions for use in other files
module.exports = {
  getAllCourses,
  getSingleCourse,
  createCourse,
  updateCourse,
  deleteCourse,
};

// Summary:
// This module provides handlers for managing courses and bootcamps,
// including getting all courses, getting a single course, adding a new course,
// and deleting a bootcamp. It uses async/await and custom error handling for
// efficient server responses.

// Takeaway:
// The code structure utilizes best practices for Node.js and Express by using
// middleware for error handling and modularizing functions. The usage of async
// utilities simplifies the process of managing asynchronous operations.
