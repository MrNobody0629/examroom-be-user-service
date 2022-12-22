const Router = require('express').Router();

const { authToken } = require('../../middlewares/authMiddleware');
const { uploadFile } = require('../../middlewares/fileUpload');
const { customRedisRateLimiter } = require('../../middlewares/rateLimiter');
const userController = require('./user.controller');

Router.post('/create-user', userController.createUser);

Router.get('/login', customRedisRateLimiter, userController.logIn);

Router.get('/get-profile', authToken, userController.getDetails);

Router.get('/check-kyc', authToken, userController.getKycDetails);

Router.post(
  '/update-kyc',
  authToken,
  uploadFile,
  userController.updateKycDetails
);

module.exports = Router;
