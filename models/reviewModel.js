const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a title for the review'],
  },

  text: {
    type: String,
    required: [true, 'Please add some text'],
  },

  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, 'Please add a rating between 1 and 10'],
  },

  createAt: {
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

// prevent dupliacte review
reviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

// statics method, you should call it on the model Model.methodName
reviewSchema.statics.getAverageRating = async function (bootcampId) {
  // this refers to the model
  const stats = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },

    {
      $group: {
        _id: '$bootcamp',
        averageRating: { $avg: '$rating' },
      },
    },
  ]);

  try {
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
      averageRating: stats[0].averageRating,
    });
  } catch (err) {}
};

// Call getAverageCost after save
reviewSchema.post('save', function () {
  this.constructor.getAverageRating(this.bootcamp);
});

// call getAverageCose before remove
reviewSchema.post(/^findOneAnd/, function (doc) {
  if (doc) this.model.getAverageRating(doc.bootcamp);
});

const Review = mongoose.model('review', reviewSchema);

module.exports = Review;
