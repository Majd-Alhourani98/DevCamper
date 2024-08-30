// Importing necessary modules and utilities
const path = require('path');
const Bootcamp = require('./../models/bootcampModel');
const appError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const geocoder = require('./../utils/geocoder');

// Function to get all bootcamps
// Method: GET /api/v1/bootcamps
// Access: Public
const getAllBootcamps = catchAsync(async (req, res, next) => {
  res.status(200).json(res.response);
});

// Function to get a single bootcamp by ID
// Method: GET /api/v1/bootcamps/:id
// Access: Public
const getSingleBootcamp = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const bootcamp = await Bootcamp.findById(id);

  // If bootcamp is not found, return error
  if (!bootcamp)
    return next(
      new appError(`Bootcamp not found with id of ${req.params.id}`, 404)
    );

  res.status(200).json({
    success: true,
    data: { bootcamp },
  });
});

// Function to create a new bootcamp
// Method: POST /api/v1/bootcamps
// Access: Private
const createBootcamp = catchAsync(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);

  res.status(201).json({
    success: true,
    data: { bootcamp },
  });
});

// Function to update an existing bootcamp by ID
// Method: PUT /api/v1/bootcamps/:id
// Access: Private
const updateBootcamp = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  // If bootcamp is not found, return error
  if (!bootcamp)
    return next(
      new appError(`Bootcamp not found with id of ${req.params.id}`, 404)
    );

  res.status(201).json({
    success: true,
    data: { bootcamp },
  });
});

// Function to delete a bootcamp by ID
// Method: DELETE /api/v1/bootcamps/:id
// Access: Private
const deleteBootcamp = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const bootcamp = await Bootcamp.findByIdAndDelete(id);

  // If bootcamp is not found, return error
  if (!bootcamp)
    return next(
      new appError(`Bootcamp not found with id of ${req.params.id}`, 404)
    );

  res.status(204).json({
    success: true,
    data: null,
  });
});

// Function to get bootcamps within a specific radius
// Method: GET /api/v1/bootcamps/radius/:zipcode/:distance
// Access: Public
const getBootcampInRadius = catchAsync(async (req, res, next) => {
  const { zipcode, distance } = req.params;
  console.log(zipcode, distance);

  // Get latitude and longitude from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calculate radius using radians
  const radius = distance / 3963; // Radius of Earth in miles

  // Find bootcamps within the radius
  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(204).json({
    success: true,
    result: bootcamps.length,
    data: { bootcamps },
  });
});

// Function to upload photo for bootcamp
// Method: Put /api/v1/bootcamps/:id/photo
// Access: Private

const bootcampPhotoUpload = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const bootcamp = await Bootcamp.findById(id);

  if (!bootcamp)
    return next(
      new appError(`Bootcamp not found with id of ${req.params.id}`),
      404
    );

  if (!req.files) return next(new appError(`Please upload a file`, 400));

  // the uploaded image must an input name[file] to access ir via req.files.file
  const file = req.files.file;
  console.log(file.mimetype);
  // check if the file is an image
  if (!file.mimetype.startsWith('image'))
    return next(new appError(`Please upload an image file`, 400));

  // check file size
  if (file.size > process.env.MAX_FILE_UPLOAD)
    return next(new appError(`Please upload an image less then 1MB`, 400));

  // Create custom filename
  file.name = `photo_${bootcamp._id}${path.extname(file.name)}`;

  // upload the file on the server
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if (err) return next(new appError(`Problem with file upload`, 500));

    // insert the file name into the database
    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({
      success: true,

      data: { file: file.name },
    });
  });
});

// Export all bootcamp-related functions
module.exports = {
  getAllBootcamps,
  getSingleBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampInRadius,
  bootcampPhotoUpload,
};

// Summary: This file defines a set of CRUD (Create, Read, Update, Delete) operations and additional functionalities
// for managing bootcamps in a RESTful API. The operations include retrieving all bootcamps with filtering, sorting,
// and pagination options, fetching a single bootcamp by ID, creating a new bootcamp, updating an existing bootcamp,
// and deleting a bootcamp. Additionally, it includes a function to find bootcamps within a specific geographic radius
// based on a provided zipcode and distance.

// Takeaway Note:
// 1. Use of `catchAsync` for handling asynchronous functions and reducing repetitive try-catch blocks.
// 2. Use of `appError` utility for consistent error handling across routes.
// 3. Advanced filtering, sorting, selecting fields, and pagination techniques are implemented using Mongoose queries.
// 4. Use of geocoding to calculate bootcamps within a certain radius demonstrates integration with third-party APIs.
