const express = require('express');
const {
  signupValidator,
  loginValidator,
} = require('../utils/validators/authValidator');

const {
  signup,
  login,
  forgotPassword,
  verifyPassResetCode,
  resetPassword,
  googleLogin,
} = require('../Controllers/authService');

const AuthRouter = express.Router();

AuthRouter.post('/signup', signupValidator, signup);
AuthRouter.post('/login', loginValidator, login);
AuthRouter.post('/forgotPassword', forgotPassword);
AuthRouter.post('/verifyResetCode', verifyPassResetCode);
AuthRouter.put('/resetPassword', resetPassword);
AuthRouter.post("/google-login", googleLogin);

module.exports = AuthRouter;