const express = require('express');

const {
  addProductToCart,
  getLoggedUserCart,
  removeSpecificCartItem,
  clearCart,
  updateCartItemQuantity,
  applyCoupon,
} = require('../controllers/cartcontroller');
const authService = require('../controllers/authService');

const CartRouter = express.Router();

CartRouter.use(authService.protect, authService.allowedTo('user'));
CartRouter
  .route('/')
  .post(addProductToCart)
  .get(getLoggedUserCart)
  .delete(clearCart);

CartRouter.put('/applyCoupon', applyCoupon);

CartRouter
  .route('/:itemId')
  .put(updateCartItemQuantity)
  .delete(removeSpecificCartItem);

module.exports = CartRouter;
