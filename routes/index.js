const ReviewRoute = require("./review");
const ProductRoute = require("./product")
const CartRoute = require("./cart")
const OrderRoute = require("./order")
const UserRoute = require("./user")
const CouponRoute = require("./coupon")
const AuthRoute = require("./auth")
const BlogRoute = require("./blog")
const CommentRoute = require("./comment")
const InvoiceRoute = require("./invoice")
const SampleRoute = require("./sample")

const mountRoutes = (app) => {
  app.use('/api/v1/products', ProductRoute);
  app.use('/api/v1/users', UserRoute);
  app.use('/api/v1/auth', AuthRoute);
  app.use('/api/v1/reviews', ReviewRoute);
  app.use('/api/v1/coupons', CouponRoute);
  app.use('/api/v1/cart', CartRoute);
  app.use('/api/v1/orders', OrderRoute);
  app.use('/api/v1/blogs', BlogRoute);
  app.use('/api/v1/comments', CommentRoute);
  app.use('/api/v1/invoices', InvoiceRoute);
  app.use('/api/v1/samples', SampleRoute)
};

module.exports = mountRoutes;