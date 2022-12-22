const { User } = require('../../models');
const { generateHash, verifyHash, generateToken } = require('../../utils');
const { AppError } = require('../../utils/errorHandler');
const axios = require('axios');
const FormData = require('form-data');
const config = require('../../config');
if (!('fileServerConfig' in config)) {
  throw new AppError(
    'user.service.js',
    'Please provide fileServerConfig',
    'custom',
    500
  );
}
const { fileServerConfig } = config;

const createUser = async (payload) => {
  const { name, email, password, confirmPassword } = payload;

  const user = await User.findOne({
    email: payload.email,
  });

  if (!email) {
    throw new AppError('createUser', 'Email required!', 'custom', 422);
  }

  if (!password || !confirmPassword) {
    throw new AppError(
      'createUser',
      'password or confirmPassword required!',
      'custom',
      422
    );
  }

  if (user) {
    throw new AppError(
      'createUser',
      'User already exists, Provide another mail',
      'custom',
      422
    );
  }

  if (password != confirmPassword) {
    throw new AppError(
      'createUser',
      'Password & confirmPassword must be same',
      'custom',
      422
    );
  }

  const hashPassword = await generateHash(password);

  return await User.create({
    name,
    email,
    password: hashPassword,
    documentUrl: null,
    isActive: true,
  });
};

const logIn = async (payload) => {
  const { email, password } = payload;
  if (!email) {
    throw new AppError('logIn', 'Email required', 'custom', 422);
  }
  if (!password) {
    throw new AppError('logIn', 'Password required', 'custom', 422);
  }
  const user = await User.findOne({
    email: email,
  });

  if (!user) {
    throw new AppError('logIn', 'User not found', 'custom', 404);
  }

  const isMatched = await verifyHash(password, user.password);

  if (!isMatched) {
    throw new AppError('logIn', 'Incorrect password', 'custom', 422);
  }

  const token = generateToken({ id: user.id });
  return { token };
};

const getDetails = async (payload) => {
  const user = await User.findOne({
    email: payload.email,
  });

  if (!user) {
    throw new AppError('getKycDetails', 'User not found', 'custom', 404);
  }

  return user;
};

const getKycDetails = async (payload) => {
  const user = await User.findOne({
    email: payload.email,
  });

  if (!user) {
    throw new AppError('getKycDetails', 'User not found', 'custom', 404);
  }

  if (!user.isKycUpdated) {
    throw new AppError('getKycDetails', 'Kyc is not completed', 'custom', 422);
  }

  return { message: 'Kyc Document Url', url: user.documentUrl };
};

const updateKycDetails = async (payload) => {
  let { fileData, userData } = payload;

  if (!fileData) {
    throw new AppError('updateKycDetails', 'File not found', 'custom', 404);
  }
  fileData.buffer.name = fileData.originalname;
  const formData = new FormData();
  formData.append('file', fileData.buffer);
  const response = await axios
    .post(`${fileServerConfig.url}/api/v1/file/upload`, formData)
    .then((data) => {
      return data.data;
    })
    .catch((error) => {
      return error.response.data;
    });
  if (response.status == 'fail') {
    throw new AppError('updateKycDetails', 'File not uploaded', 'custom', 500);
  }
  userData.documentUrl = response.data.url;
  userData.isKycUpdated = true;
  await userData.save();
  return 'Your KYC updated successfully!';
};

module.exports = {
  createUser,
  logIn,
  getDetails,
  getKycDetails,
  updateKycDetails,
};
