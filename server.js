require('dotenv').config();
const express = require('express');
const connectDB = require('./src/db');
require('./src/middlewares/rateLimiter');
const { errorHandler, AppError } = require('./src/utils/errorHandler');

const app = express();
const config = require('./src/config');
if (!('serverConfig' in config)) {
  throw new AppError(
    'server.js',
    'Please Provide serverConfig in configFile',
    'custom',
    500
  );
}
const { serverConfig } = config;
const PORT = serverConfig.port ? serverConfig.port : 3000;

app.use(express.json());
// connectRedis();
connectDB();

require('./src/routes')(app);

app.get('/', function (req, res) {
  res.json({ message: 'Server is running in latest pull' });
});

app.use((error, req, res, next) => {
  return errorHandler(error, res);
});

app.listen(PORT, function () {
  console.log(`Node Server is Running on http://localhost:${PORT}`);
});
