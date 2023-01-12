const catchAsync = require("../catchAsync.js");
const Region = require("../models/region.model.js");
const Student = require("../models/student.model.js");

exports.getAllRegions = catchAsync(async (req, res, next) => {
  const region = req.query.region;
  const batch = req.query.batch;

  if (region && batch) {
    const tempregion = await Region.find({
      regionName: req.query.region,
    });
    if (!tempregion) {
      return next(new AppError("No region found", 404));
    }
    let tempBatch = tempregion[0].batches.filter((val) => val.name === batch);

    return res.status(200).json({
      tempBatch,
    });
  }
  const regions = await Region.find();

  //Send the response
  res.status(200).json({
    total: regions.length,
    regions,
  });
});

exports.getRegion = catchAsync(async (req, res, next) => {
  const region = await Region.find({ regionName: req.params.region });
  if (!region) {
    return next(new AppError("No region found with that id!", 404));
  }
  res.status(200).json({
    region,
  });
});

exports.updateRegion = catchAsync(async (req, res) => {
  var tempRegion = await Region.findOne({ regionName: req.params.region });

  for (let index = 0; index < tempRegion.batches.length; index++) {
    if (tempRegion.batches[index].name === req.body.batch) {
      tempRegion.batches[index].completed = true;
      break;
    }
  }
  var updatedRegion = await Region.findOneAndUpdate(
    { regionName: req.params.region },
    tempRegion,
    { new: true }
  );
  res.status(200).json({
    status: "sucess",
    updatedRegion,
  });
});

function containsObject(obj, list) {
  var i;
  for (i = 0; i < list.length; i++) {
    if (JSON.stringify(list[i]) === obj) {
      return true;
    }
  }

  return false;
}
exports.refreshRegions = catchAsync(async (req, res, next) => {
  const students = await Student.find();

  for (const student in students) {
    if (Object.hasOwnProperty.call(students, student)) {
      const element = students[student];
      const exists = await Region.find({ regionName: element.Region });
      if (exists.length === 0) {
        const tempRegion = {
          regionName: element.Region,
          description: `It is one of the nine ethnically-based regional states of Ethiopia. It is located in the Horn of Africa and is bordered by several other regions`,
          batches: [{ name: element.Batch, completed: false }],
        };
        await Region.create(tempRegion);
        // console.log(
        //   "added region ",
        //   element.Region,
        //   " batch ",
        //   element.Batch,
        //   "cuz region not exist"
        // );
      } else {
        if (exists[0].batches) {
          const batchExists = containsObject(
            JSON.stringify({ name: element.Batch, completed: false }),
            exists[0].batches
          );
          if (batchExists) continue;
          else {
            if (element.Batch) {
              var tempBatches = exists[0].batches;
              element.Batch
                ? tempBatches.push({ name: element.Batch, completed: false })
                : tempBatches.push("Batchless");
              exists[0].batches = tempBatches;
              await exists[0].save();
              // console.log(
              //   "added batch ",
              //   element.Batch,
              //   " to region ",
              //   element.Region
              // );
            }
          }
        } else {
          const tempRegion = {
            regionName: element.Region,
            description: `It is one of the nine ethnically-based regional states of Ethiopia. It is located in the Horn of Africa and is bordered by several other regions`,
            batches: [{ name: element.Batch, completed: false }],
          };
          await Region.create(tempRegion);
          // console.log(
          //   "added region ",
          //   element.Region,
          //   " batch ",
          //   element.Batch
          // );
        }
      }
    }
  }
  const regions = await Region.find();

  //Send the response
  res.status(200).json({
    total: regions.length,
    regions,
  });
  /* } catch (err) {
    res.status(404).json({
      status: "Fail",
      message: err,
    });
  }*/
});

// exports.checkRefresh = catchAsync(async (req, res, next) => {
//   const students = await Student.find();

//   for (const student in students) {
//     if (Object.hasOwnProperty.call(students, student)) {
//       const element = students[student];
//       const exists = await Region.find({ regionName: element.Region });
//       if (exists.length === 0) {
//         // const tempRegion = {
//         //   regionName: element.Region,
//         //   description: `It is one of the nine ethnically-based regional states of Ethiopia. It is located in the Horn of Africa and is bordered by several other regions`,
//         //   batches: [{ name: element.Batch, completed: false }],
//         // };
//         // await Region.create(tempRegion);
//         // console.log(
//         //   "added region ",
//         //   element.Region,
//         //   " batch ",
//         //   element.Batch,
//         //   "cuz region not exist"
//         // );
//         return res.status(200).json({
//           refresh: true,
//         });
//       } else {
//         if (exists[0].batches) {
//           const batchExists = containsObject(
//             JSON.stringify({ name: element.Batch, completed: false }),
//             exists[0].batches
//           );
//           if (batchExists) continue;
//           else {
//             if (element.Batch) {
//               var tempBatches = exists[0].batches;
//               element.Batch
//                 ? tempBatches.push({ name: element.Batch, completed: false })
//                 : tempBatches.push("Batchless");
//               exists[0].batches = tempBatches;
//               await exists[0].save();
//               console.log(
//                 "added batch ",
//                 element.Batch,
//                 " to region ",
//                 element.Region
//               );
//             }
//           }
//         } else {
//           const tempRegion = {
//             regionName: element.Region,
//             description: `It is one of the nine ethnically-based regional states of Ethiopia. It is located in the Horn of Africa and is bordered by several other regions`,
//             batches: [{ name: element.Batch, completed: false }],
//           };
//           await Region.create(tempRegion);
//           console.log(
//             "added region ",
//             element.Region,
//             " batch ",
//             element.Batch
//           );
//         }
//       }
//     }
//   }
//   const regions = await Region.find();

//   //Send the response
//   res.status(200).json({
//     total: regions.length,
//     regions,
//   });
//   /* } catch (err) {
//     res.status(404).json({
//       status: "Fail",
//       message: err,
//     });
//   }*/
// });

// exports.getStudent = catchAsync(async (req, res, next) => {
//   const student = await Student.findById(req.params.id);
//   if (!student) {
//     return next(new AppError("No student found with that id!", 404));
//   }
//   res.status(200).json({
//     student,
//   });
// });

// exports.createStudent = catchAsync(async (req, res, next) => {
//   const {Name, Phone_no, Grade, School, Attendance, Batch} = req.body;
//   const newStudent = await Student.create({
//     Name: req.body.Name,
//     Phone_no: req.body.Phone_no,
//     // gender: req.body.gender,
//     // age: req.body.age,
//     School: req.body.School,
//     Grade: req.body.Grade,
//     Attendance: req.body.Attendance,
//     Batch: req.body.Batch,
//     Region: req.body.Region,
//     //paid: req.body.paid,
//   });
//   res.status(200).json({
//     status: "success",
//     student: newStudent,
//   });
// });

// exports.updateStudent = catchAsync(async (req, res) => {
//   const updatedStudent = await Student.findByIdAndUpdate(
//     req.params.id,
//     req.body,
//     {new: true, runValidators: true}
//   );
//   res.status(200).json({
//     status: "sucess",
//     updatedStudent,
//   });
// });

// exports.deleteStudent = catchAsync(async (req, res, next) => {
//   const existStudent = await Student.findById(req.params.id);
//   if (!existStudent) {
//     return next(new AppError("No student found with this id!", 404));
//   }
//   const deleteStudent = await Student.findByIdAndDelete(req.params.id);
//   res.status(200).json({
//     status: "sucess",
//     student: deleteStudent,
//   });
// });
