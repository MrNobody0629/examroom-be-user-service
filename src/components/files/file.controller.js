const { AppError } = require('../../utils/errorHandler');
const { successResponse } = require('../../utils/responseHandler');
const fileService = require('./file.service');
const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new AppError('file-upload', 'File not found', 'custom', 404);
    }
    const data = await fileService.uploadFile(req.file);
    successResponse(res, data);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports = {
  uploadFile,
};
