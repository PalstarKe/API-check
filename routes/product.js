const express = require('express');
const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require('../utils/validators/productValidator');

const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
} = require('../controllers/productcontroller');
const authService = require('../controllers/authService');
const reviewsRoute = require('./review');

const ProductRouter = express.Router();

// POST   /products/jkshjhsdjh2332n/reviews
// GET    /products/jkshjhsdjh2332n/reviews
// GET    /products/jkshjhsdjh2332n/reviews/87487sfww3
ProductRouter.use('/:productId/reviews', reviewsRoute);

ProductRouter
  .route('/')
  .get(getProducts)
  .post(
    authService.protect,
    authService.allowedTo('admin', 'user', 'writer'),
    uploadProductImages,
    createProductValidator,
    createProduct
  );
ProductRouter
  .route('/:id')
  .get(getProductValidator, getProduct)
  .put(
    authService.protect,
    authService.allowedTo('admin', 'user'),
    uploadProductImages,
    updateProductValidator,
    updateProduct
  )
  .delete(
    authService.protect,
    authService.allowedTo('admin', 'user'),
    deleteProductValidator,
    deleteProduct
  );

module.exports = ProductRouter;
