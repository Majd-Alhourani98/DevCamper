const Bootcamp = require('./../models/bootcampModel');

const appError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

// description: GET all bootcamps
// route:       GET /api/v1/bootcamps
// access       Public
const getAllBootcamps = catchAsync(async (req, res, next) => {
  const bootcamps = await Bootcamp.find();
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

  if (!bootcamp) return next(new appError(`Bootcamp not found with id of ${req.params.id}`, 404));

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

  if (!bootcamp) return next(new appError(`Bootcamp not found with id of ${req.params.id}`, 404));

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

  if (!bootcamp) return next(new appError(`Bootcamp not found with id of ${req.params.id}`, 404));

  res.status(204).json({
    success: true,
    data: null,
  });
});

module.exports = {
  getAllBootcamps,
  getSingleBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
};
