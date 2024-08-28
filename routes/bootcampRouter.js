const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'get all bootcamps',
  });
});

router.get('/:id', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'get single bootcamp',
  });
});

router.post('/', (req, res) => {
  res.status(201).json({
    success: true,
    message: 'Create Bootcamp',
  });
});

router.put('/:id', (req, res) => {
  res.status(201).json({
    success: true,
    message: 'Update Bootcamp',
  });
});

router.delete('/:id', (req, res) => {
  res.status(204).json({
    success: true,
    message: 'delete Bootcamp',
  });
});

module.exports = router;
