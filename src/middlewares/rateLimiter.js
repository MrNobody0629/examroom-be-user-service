const moment = require('moment');
const redis = require('redis');
const redisClient = redis.createClient();
const WINDOW_SIZE_IN_HOURS = 1;
const EXPIRY_TIME = 60 * 60 * WINDOW_SIZE_IN_HOURS;
const MAX_WINDOW_REQUEST_COUNT = 3;

redisClient.on('error', (err) => console.log('Redis Client Error', err));
exports.connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log('Redis Client Connected Succesfully');
  } catch (error) {
    console.log('Redis Client Error', error);
  }
};

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
      await redisClient.setEx(req.ip, EXPIRY_TIME, ipData);
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
      await redisClient.setEx(
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
