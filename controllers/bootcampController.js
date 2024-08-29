const Bootcamp = require('./../models/bootcampModel');

const appError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

const geocoder = require('./../utils/geocoder');

// description: GET all bootcamps
// route:       GET /api/v1/bootcamps
// access       Public
const getAllBootcamps = catchAsync(async (req, res, next) => {
  // 1) Filtering

  // Fields to exclude
  let queryObject = { ...req.query };
  const excludedFiels = ['select', 'page', 'sort'];
  excludedFiels.forEach(field => delete queryObject[field]);

  // create operator ($gt, $gte, etc)
  let queryStr = queryObject;
  queryStr = JSON.stringify(queryStr);
  queryStr = queryStr.replace(/\b(lte|lt|gte|gt|in)\b/g, match => `$${match}`);

  // setup the query
  let query = Bootcamp.find(JSON.parse(queryStr));

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  const bootcamps = await Bootcamp.find(query);
  res.status(200).json({
    success: true,
    result: bootcamps.length,
    data: { bootcamps },
  });
});

// description: GET all bootcamps
// route:       GET /api/v1/bootcamps/:id
// access       Public

const getSingleBootcamp = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const bootcamp = await Bootcamp.findById(id);

  if (!bootcamp)
    return next(
      new appError(`Bootcamp not found with id of ${req.params.id}`, 404)
    );

  res.status(200).json({
    success: true,
    data: { bootcamp },
  });
});

// description: Create new bootcamp
// route:       POST /api/v1/bootcamps
// access       Private
const createBootcamp = catchAsync(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);

  res.status(201).json({
    success: true,
    data: { bootcamp },
  });
});

// description: Update  bootcamp
// route:       PUT /api/v1/bootcamps/:id
// access       Private
const updateBootcamp = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!bootcamp)
    return next(
      new appError(`Bootcamp not found with id of ${req.params.id}`, 404)
    );

  res.status(201).json({
    success: true,
    data: { bootcamp },
  });
});

// description: Delete bootcamp
// route:       DELETE /api/v1/bootcamps/:id
// access       Private
const deleteBootcamp = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const bootcamp = await Bootcamp.findByIdAndDelete(id);

  if (!bootcamp)
    return next(
      new appError(`Bootcamp not found with id of ${req.params.id}`, 404)
    );

  res.status(204).json({
    success: true,
    data: null,
  });
});

// description: Get bootcamps within a radius
// route:       GET  /api/v1/bootcamps/radius/:zipcode/:distance
// access       public
const getBootcampInRadius = catchAsync(async (req, res, next) => {
  const { zipcode, distance } = req.params;
  console.log(zipcode, distance);
  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // calculate radius using radians
  // divide distance by radius of earth
  // earth radius = 3,963 mi / 6,378km
  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphare: [[lng, lat], radius] } },
  });

  res.status(204).json({
    success: true,
    result: bootcamps.length,
    data: { bootcamps },
  });
});

module.exports = {
  getAllBootcamps,
  getSingleBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampInRadius,
};

// Filtering Notes:

// search inside an object "location.city=Boston" in the Url
