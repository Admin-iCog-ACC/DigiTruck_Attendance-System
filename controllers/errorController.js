const {mongoose} = require("mongoose");
const AppError = require("../appError");

const handleCastErrorDB = (err) => {
  const message = `Invalid Input ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];

  console.log(value);
  const message = `: ${value} is  taken please use another value`;
  return new AppError(message, 400);
};

handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Inavlid input data ${errors.join(". ")}`;
  return new AppError(message, 400);
};

/*const sendError = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
};
*/
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  //operational , trusted error send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    //programming or unknown error dont leak the detail to the client
  } else {
    //1) Log the error
    console.error("ERROR", err);

    //2) send generic message to the client
    res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
};
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  /*let error = {...err};
  if (error.name === "CastError") error = handleCastErrorDB(error);
  sendError(error, res);*/

  /*if (err instanceof mongoose.CastError) {
    return new AppError("invalid id", 404);
  }*/

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = {...err};
    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === "ValidationError")
      error = handleValidationErrorDB(error);
    sendErrorProd(error, res);
  }

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
