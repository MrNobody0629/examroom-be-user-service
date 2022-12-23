const config = require('../../config');
const fs = require('fs');
const { AppError } = require('../../utils/errorHandler');
const axios = require('axios');
const FormData = require('form-data');

if (!('fileServerConfig' in config)) {
  throw new AppError(
    'file.service.js',
    'Please provide fileServerConfig in configFile',
    'custom',
    500
  );
}
const { fileServerConfig } = config;

const uploadFile = async (file) => {
  if (!['application/pdf'].includes(file.mimetype)) {
    throw new AppError(
      'uploadFile',
      'Only pdf files is acceptable',
      'custom',
      500
    );
  }

  file.buffer.name = file.originalname;
  const formData = new FormData();
  formData.append('file', file.buffer);
  const response = await axios
    .post(`${fileServerConfig.url}/api/v1/file/upload`, formData)
    .then((data) => {
      return data.data;
    })
    .catch((error) => {
      return error.response.data;
    });
  if (response.status == 'fail') {
    throw new AppError(
      'updateKycDetails',
      'File server not responding',
      'custom',
      500
    );
  }
  return response;
};

module.exports = {
  uploadFile,
};
