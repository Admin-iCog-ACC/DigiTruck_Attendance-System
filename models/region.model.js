const mongoose = require("mongoose");
const regionSchema = new mongoose.Schema({
  regionName: {
    type: String,
    required: [true, "Please provide region name"],
    unique: true,
  },
  batches: {
    type: Array,
    default: [],
  },
  description: {
    type: String,
    required: [true, "Please provide description"],
  },
});

const Region = mongoose.model("Region", regionSchema);
module.exports = Region;
