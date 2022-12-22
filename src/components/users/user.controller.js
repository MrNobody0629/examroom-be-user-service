const { successResponse } = require('../../utils/responseHandler');
const userService = require('./user.service');
const createUser = async (req, res, next) => {
  try {
    const bodyData = req.body;
    const queryData = req.query;
    const payload = {
      ...bodyData,
      ...queryData,
    };
    const data = await userService.createUser(payload);
    successResponse(res, data);
  } catch (error) {
    next(error);
  }
};

const logIn = async (req, res, next) => {
  try {
    const bodyData = req.body;
    const queryData = req.query;
    const payload = {
      ...bodyData,
      ...queryData,
    };
    const data = await userService.logIn(payload);
    successResponse(res, data);
  } catch (error) {
    next(error);
  }
};

const getDetails = async (req, res, next) => {
  try {
    const userData = req.user;
    const data = await userService.getDetails(userData);
    successResponse(res, data);
  } catch (error) {
    next(error);
  }
};

const getKycDetails = async (req, res, next) => {
  try {
    const userData = req.user;
    const data = await userService.getKycDetails(userData);
    successResponse(res, data);
  } catch (error) {
    next(error);
  }
};

const updateKycDetails = async (req, res, next) => {
  try {
    const userData = req.user;
    const fileData = req.file;
    const payload = { userData, fileData };
    const data = await userService.updateKycDetails(payload);
    successResponse(res, data);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = {
  createUser,
  logIn,
  getDetails,
  getKycDetails,
  updateKycDetails,
};
