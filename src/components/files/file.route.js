const Router = require('express').Router();
const { fileUpload, uploadFile } = require('../../middlewares/fileUpload');
const fileController = require('./file.controller');

Router.post('/upload', uploadFile, fileController.uploadFile);

module.exports = Router;
