const errorResponse = (res, statusCode, status, message, error) => {
  res.status(statusCode).json({
    status,
    message,
    error,
  });
};
const successResponse = (res, data) => {
  res.status(200).json({
    status: "success",
    data,
  });
};
module.exports = { errorResponse, successResponse };
