const express = require('express');
const {
  findAllOrders,
  findSpecificOrder,
  filterOrderForLoggedUser,
  updateOrderToDelivered,
  checkoutSession,
} = require('../controllers/ordercontroller');

const authService = require('../controllers/authService');

const OrderRouter = express.Router();

OrderRouter.use(authService.protect);

OrderRouter.get(
  '/checkout-session/:cartId',
  authService.allowedTo('user'),
  checkoutSession
);

//OrderRouter.route('/:cartId').post(authService.allowedTo('user'), createCashOrder);
OrderRouter.get(
  '/',
  authService.allowedTo('user', 'admin', 'writer'),
  filterOrderForLoggedUser,
  findAllOrders
);
OrderRouter.get('/:id', findSpecificOrder);

// OrderRouter.put(
//   '/:id/pay',
//   authService.allowedTo('admin', 'writer'),
//   updateOrderToPaid
// );
OrderRouter.put(
  '/:id/deliver',
  authService.allowedTo('admin', 'writer'),
  updateOrderToDelivered
);

module.exports = OrderRouter;