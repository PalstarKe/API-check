const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    document_type: {
      type: String,
      required: true,
    },
    subject_area: {
      type: String,
      required: true,
    },
    academic_level: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    due_date: {
      type: String,
      required: true,
    },
    time_due: {
      type: String,
      required: true,
    },
    pages: {
      type: Number,
      required: true,
    },
    page_spacing: {
      type: String,
      required: true,
    },
    powerpoint_slides: {
      type: Number,
      required: true,
    },
    paper_format: {
      type: String,
      required: true,
    },
    sources: {
      type: Number,
      required: true,
    },
    Writer_id: {
      type: Number,
    },
    writer_level: {
      type: String,
      required: true,
    },
    paper_topic: {
      type: String,
      required: true,
    },
    paper_description: {
      type: String,
      required: true,
    },
    attachments: {
      type: String,
    },
  },
  {
    timestamps: true,
    // to enable virtual populate
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Mongoose query middleware
ProductSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'product',
    select: 'name -_id',
  });
  next();
});

const Product = mongoose.model('Product', ProductSchema);
module.exports = Product
