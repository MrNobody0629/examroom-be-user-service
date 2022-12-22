const moment = require('moment');
const Redis = require('ioredis');
const config = require('../config');
const { AppError } = require('../utils/errorHandler');

if (!('redisConfig' in config)) {
  throw new AppError('rateLimiter.js', 'redisConfig required', 'custom', 404);
}
const { redisConfig } = config;
const { uri, port, password } = redisConfig;

const redisClient = Redis.createClient({
  port,
  host: uri,
  password,
});

redisClient.on('connect', function (error) {
  if (!error) {
    console.log('Redis connected successfully!');
  } else {
    console.log(`Redis Client Error ${error}`);
  }
});

const WINDOW_SIZE_IN_HOURS = 1;
const EXPIRY_TIME = 60 * 60 * WINDOW_SIZE_IN_HOURS;
const MAX_WINDOW_REQUEST_COUNT = 3;

exports.customRedisRateLimiter = async (req, res, next) => {
  try {
    if (!redisClient) {
      throw new Error('Redis client does not exist!');
    }

    const record = await redisClient.get(req.ip);
    const currentRequestTime = moment().utc().valueOf();

    if (!record) {
      const ipData = JSON.stringify([
        {
          requestTimeStamp: currentRequestTime,
          requestCount: 1,
        },
      ]);
      await redisClient.setex(req.ip, EXPIRY_TIME, ipData);
      return next();
    }

    let data = JSON.parse(record);
    let beforeTime = moment(currentRequestTime)
      .subtract(WINDOW_SIZE_IN_HOURS, 'hours')
      .utc()
      .valueOf();
    let requestsWithinTime = data.filter((entry) => {
      return entry.requestTimeStamp > beforeTime;
    });

    if (requestsWithinTime.length >= MAX_WINDOW_REQUEST_COUNT) {
      res.status(429).json({
        status: false,
        message: `You have exceeded the ${MAX_WINDOW_REQUEST_COUNT} requests in ${WINDOW_SIZE_IN_HOURS} hrs limit!`,
      });
    } else {
      const ipData = {
        requestTimeStamp: currentRequestTime,
        requestCount: 1,
      };
      requestsWithinTime.push(ipData);
      await redisClient.setex(
        req.ip,
        EXPIRY_TIME,
        JSON.stringify(requestsWithinTime)
      );
      next();
    }
  } catch (error) {
    next(error);
  }
};
