const express = require('express');
const router = express.Router();

const {
  getAllBootcamps,
  getSingleBootcamp,
  createBootcamp,
  deleteBootcamp,
  updateBootcamp,
  getBootcampInRadius,
} = require('./../controllers/bootcampController');

router.route('/radius/:zipcode/:distance', getBootcampInRadius);

router.route('/').get(getAllBootcamps).post(createBootcamp);

router
  .route('/:id')
  .get(getSingleBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

module.exports = router;

// 02118/10
