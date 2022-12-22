module.exports = {
  serverConfig: {
    port: process.env.USER_SERVER_PORT,
    url: process.env.USER_SERVER_URL,
  },
  fileServerConfig: {
    port: process.env.FILE_SERVER_PORT,
    url: process.env.FILE_SERVER_URL,
  },
  dbConfig: {
    mongoUrlString: process.env.MONGO_DB_URL,
  },
  redisConfig: {
    uri: process.env.REDIS_URL,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
  },
};
