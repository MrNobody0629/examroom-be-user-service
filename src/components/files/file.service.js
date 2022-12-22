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
  file.buffer.name = file.originalname;
  const formData = new FormData();
  formData.append('file', file.buffer);
  const response = await axios.post(
    `${fileServerConfig.url}/api/v1/file/upload`,
    formData
  );
  return response.data;
};

module.exports = {
  uploadFile,
};
