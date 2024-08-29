const express = require('express');
const router = express.Router({ mergeParams: true });

const { getAllCourses } = require('./../controllers/courseController');

router.route('/').get(getAllCourses);
// .post(createCourse);

// router
//   .route('/:id')
//   .get(getSingleCourse)
//   .put(updateCourse)
//   .delete(deleteCourse);

module.exports = router;

// 02118/10
