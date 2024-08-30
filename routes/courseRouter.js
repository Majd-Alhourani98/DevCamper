const express = require('express');
const router = express.Router({ mergeParams: true });

const {
  getAllCourses,
  getSingleCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} = require('./../controllers/courseController');

const { protect } = require('../controllers/authController');

const queryBuilder = require('./../middlewares/queryBuilder');
const Course = require('./../models/CourseModel');

router
  .route('/')
  .get(
    queryBuilder(Course, {
      path: 'bootcamp', // Populate bootcamp field
      select: 'name description', // Select fields to display
    }),

    getAllCourses
  )
  .post(protect, createCourse);

router.route('/:id').get(getSingleCourse).put(updateCourse).delete(deleteCourse);

module.exports = router;
