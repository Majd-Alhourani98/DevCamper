const Bootcamp = require('./../models/bootcampModel');

// description: GET all bootcamps
// route:       GET /api/v1/bootcamps
// access       Public
const getAllBootcamps = async (req, res) => {
  try {
    const bootcamps = await Bootcamp.find();
    res.status(200).json({
      success: true,
      result: bootcamps.length,
      data: { bootcamps },
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err,
    });
  }
};

// description: GET all bootcamps
// route:       GET /api/v1/bootcamps/:id
// access       Public
const getSingleBootcamp = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'get single bootcamp',
  });
};

// description: Create new bootcamp
// route:       POST /api/v1/bootcamps
// access       Private
const createBootcamp = async (req, res) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);

    res.status(201).json({
      success: true,
      data: { bootcamp },
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err,
    });
  }
};

// description: Update  bootcamp
// route:       PUT /api/v1/bootcamps/:id
// access       Private
const updateBootcamp = (req, res) => {
  res.status(201).json({
    success: true,
    message: 'Update Bootcamp',
  });
};

// description: Delete bootcamp
// route:       DELETE /api/v1/bootcamps/:id
// access       Private
const deleteBootcamp = (req, res) => {
  res.status(204).json({
    success: true,
    message: 'delete Bootcamp',
  });
};

module.exports = {
  getAllBootcamps,
  getSingleBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
};
