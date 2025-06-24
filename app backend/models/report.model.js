const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: [3, "Title must be at least 3 characters long"],
  },
  description: String,
  image: String,
  location: {
    latitude: Number,
    longitude: Number,
  },
  type: { type: String, enum: ["pothole", "blockage", "hazard", "stopage"] ,default: "blockage" },
  status: { type: String, enum: ["pending", "verified", "solved"], default: "pending" },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true,},
}, { timestamps: true });

module.exports = mongoose.model("Report", reportSchema);