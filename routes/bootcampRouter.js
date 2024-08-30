const express = require('express');
const {
  getAllBootcamps,
  getSingleBootcamp,
  createBootcamp,
  deleteBootcamp,
  updateBootcamp,
  getBootcampInRadius,
  bootcampPhotoUpload,
} = require('./../controllers/bootcampController');

// Include other resource routers
const courseRouter = require('./courseRouter');

const router = express.Router();

// re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampInRadius);
router.route('/:id/photo').put(bootcampPhotoUpload);

router.route('/').get(getAllBootcamps).post(createBootcamp);

router
  .route('/:id')
  .get(getSingleBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

module.exports = router;

// 02118/10
