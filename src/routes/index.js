const userRoute = require('../components/users/user.route');
const fileRoute = require('../components/files/file.route');
module.exports = (app) => {
  app.use('/api/v1/users', userRoute);
  app.use('/api/v1/files', fileRoute);
};
