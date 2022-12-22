var multer = require('multer');
const STORAGE = multer.memoryStorage();

exports.uploadFile = multer({ storage: STORAGE }).single('file');
