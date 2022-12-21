const mongoose = require('mongoose');
const Writer = require('./userModel');

const ReviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    ratings: {
      type: Number,
      min: [1, 'Min ratings value is 1.0'],
      max: [5, 'Max ratings value is 5.0'],
      required: [true, 'review ratings required'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to user'],
    },
    // parent reference (one to many)
    writer: {
      type: mongoose.Schema.ObjectId,
      ref: 'writer',
      required: [true, 'Review must belong to writer'],
    },
  },
  { timestamps: true }
);

ReviewSchema.pre(/^find/, function (next) {
  this.populate({ path: 'user', select: 'name' });
  next();
});

ReviewSchema.statics.calcAverageRatingsAndQuantity = async function (
  writerId
) {
  const result = await this.aggregate([
    // Stage 1 : get all reviews in specific writer
    {
      $match: { writer: writerId },
    },
    // Stage 2: Grouping reviews based on WriterID and calc avgRatings, ratingsQuantity
    {
      $group: {
        _id: 'writer',
        avgRatings: { $avg: '$ratings' },
        ratingsQuantity: { $sum: 1 },
      },
    },
  ]);

  // console.log(result);
  if (result.length > 0) {
    await Writer.findByIdAndUpdate(writerId, {
      ratingsAverage: result[0].avgRatings,
      ratingsQuantity: result[0].ratingsQuantity,
    });
  } else {
    await Writer.findByIdAndUpdate(writerId, {
      ratingsAverage: 0,
      ratingsQuantity: 0,
    });
  }
};

ReviewSchema.post('save', async function () {
  await this.constructor.calcAverageRatingsAndQuantity(this.writer);
});

ReviewSchema.post('remove', async function () {
  await this.constructor.calcAverageRatingsAndQuantity(this.writer);
});
const Review = mongoose.model('Review', ReviewSchema);
module.exports = Review
