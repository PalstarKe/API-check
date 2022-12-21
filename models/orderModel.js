const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
  {
    order_id: {
      type: mongoose.Schema.ObjectId,
      ref: 'Order'
    },
    order_title: {
      type: String
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Order must be belong to user'],
    },
    writer: {
      type: mongoose.Schema.ObjectId,
      ref: 'writer',
    },

    pages: {
      type: Number,
    },
    Deadline: {
      Date: String,
      time: String,
    },
    paper_format: {
      type: Number,
      default: 0,
    },
    totalOrderPrice: {
      type: Number,
    },
    paymentMethodType: {
      type: String,
      enum: ['card'],
      default: 'card',
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    isInRevision: {
      type: Boolean,
      default: false,
    },
    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: Date,
  },
  { timestamps: true }
);

OrderSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name profileImg email',
  }).populate({
    path: 'cartItems.product',
    select: 'title imageCover ',
  });

  next();
});
const Order = mongoose.model('Order', OrderSchema);

module.exports = Order
