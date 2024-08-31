const mongoose = require('mongoose');
const { post } = require('../routes/courseRouter');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a course title'],
  },

  description: {
    type: String,
    required: [true, 'Please add a description'],
  },

  weeks: {
    type: Number,
    required: [true, 'Please add number of weeks'],
  },

  tuition: {
    type: Number,
    required: [true, 'Please add description'],
  },

  minimumSkill: {
    type: String,
    required: [true, 'Please add a minimum skill'],
    enum: ['beginner', 'intermediate', 'advanced'],
  },

  scholarshipAvailable: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    required: true,
  },

  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
});

// statics method, you should call it on the model Model.methodName
courseSchema.statics.getAverageCost = async function (bootcampId) {
  // this refers to the model
  const stats = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },

    {
      $group: {
        _id: '$bootcamp',
        averageCost: { $avg: '$tuition' },
      },
    },
  ]);

  try {
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
      averageCost: Math.ceil(stats[0].averageCost / 10) * 10,
    });
  } catch (err) {}
};

// Call getAverageCost after save
courseSchema.post('save', function () {
  this.constructor.getAverageCost(this.bootcamp);
});

// call getAverageCose before remove
courseSchema.post('findOneAndDelete', function (doc) {
  if (doc) this.model.getAverageCost(doc.bootcamp);
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
