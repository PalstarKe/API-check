const express = require('express');
const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator,
  updateLoggedUserValidator,
} = require('../utils/validators/userValidator');

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  resizeImage,
  changeUserPassword,
  getLoggedUserData,
  updateLoggedUserPassword,
  updateLoggedUserData,
  deleteLoggedUserData,
} = require('../controllers/usercontroller');

const authService = require('../controllers/authService');

const USerRouter = express.Router();

USerRouter.use(authService.protect);

USerRouter.get('/getMe', getLoggedUserData, getUser);
USerRouter.put('/changeMyPassword', updateLoggedUserPassword);
USerRouter.put('/updateMe', updateLoggedUserValidator, updateLoggedUserData);
USerRouter.delete('/deleteMe', deleteLoggedUserData);

// Admin
USerRouter.use(authService.allowedTo('admin'));
USerRouter.put(
  '/changePassword/:id',
  changeUserPasswordValidator,
  changeUserPassword
);
USerRouter
  .route('/')
  .get(getUsers)
  .post(uploadUserImage, resizeImage, createUserValidator, createUser);
USerRouter
  .route('/:id')
  .get(getUserValidator, getUser)
  .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

module.exports = USerRouter;
