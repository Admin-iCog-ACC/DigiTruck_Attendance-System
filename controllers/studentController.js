const AppError = require("../appError.js");
const catchAsync = require("../catchAsync.js");
const Student = require("../models/student.model.js");
const protect = require("./authController");
const APIFeatures = require("../apiFeatures");

exports.getStudents = catchAsync(async (req, res, next) => {
  const region = req.query.region;
  const batch = req.query.batch;

  if (region && batch) {
    const student = await Student.find({
      Region: req.query.region,
      Batch: req.query.batch,
    });
    if (!student) {
      return next(new AppError("No student found with that id!", 404));
    }
    return res.status(200).json({
      student,
    });
  }

  const features = new APIFeatures(Student.find(), req.query)
    .filter()
    .sort()
    .limit()
    .pagination();

  const students = await features.query;

  //Send the response
  res.status(200).json({
    total: students.length,
    students,
  });

  /* } catch (err) {
    res.status(404).json({
      status: "Fail",
      message: err,
    });
  }*/
});

exports.getAllStudents = catchAsync(async (req, res, next) => {
  const students = await Student.find();

  //Send the response
  res.status(200).json({
    total: students.length,
    students,
  });
});

exports.getStudent = catchAsync(async (req, res, next) => {
  const student = await Student.findById(req.params.id);
  if (!student) {
    return next(new AppError("No student found with that id!", 404));
  }
  res.status(200).json({
    student,
  });
});

exports.createStudent = catchAsync(async (req, res, next) => {
  const { Name, Phone_Number, Grade, School, Attendance, Region } = req.body;
  const newStudent = await Student.create({
    Name: req.body.Name,
    Phone_no: req.body.Phone_Number,
    // gender: req.body.gender,
    // age: req.body.age,
    School: req.body.School,
    Grade: req.body.Grade,
    Attendance: req.body.Attendance,
    Batch: req.body.Batch,
    Region: req.body.Region,
    //paid: req.body.paid,
  });
  res.status(200).json({
    status: "success",
    student: newStudent,
  });
});

exports.updateStudent = catchAsync(async (req, res) => {
  const updatedStudent = await Student.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  res.status(200).json({
    status: "sucess",
    updatedStudent,
  });
});

exports.deleteStudent = catchAsync(async (req, res, next) => {
  const existStudent = await Student.findById(req.params.id);
  if (!existStudent) {
    return next(new AppError("No student found with this id!", 404));
  }
  const deleteStudent = await Student.findByIdAndDelete(req.params.id);
  res.status(200).json({
    status: "sucess",
    student: deleteStudent,
  });
});
