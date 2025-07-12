const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  description: String,
  image:String,
  location: {
    type: String,
    required: true,
  },
  coordinates:{
    latitude: { type: String, required: true },
    longitude: { type: String, required: true }
  },
  severityLevel: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  type: { type: String, enum: ["pothole", "blockage", "hazard", "stopage"] ,default: "blockage" },
  status: { type: String, enum: ["pending", "verified", "solved"], default: "pending" },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Report", reportSchema);