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
const getSingleBootcamp = async (req, res) => {
  const { id } = req.params;
  const bootcamp = await Bootcamp.findById(id);

  if (!bootcamp)
    return res.status(404).json({
      status: false,
      message: `there is no bootcamp with the id ${id}`,
    });

  res.status(200).json({
    success: true,
    data: { bootcamp },
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
const updateBootcamp = async (req, res) => {
  const { id } = req.params;
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!bootcamp)
    return res.status(404).json({
      status: false,
      message: `there is no bootcamp with the id ${id}`,
    });

  res.status(201).json({
    success: true,
    data: { bootcamp },
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
