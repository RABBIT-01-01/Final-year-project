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
  severityLevel: { type: String, enum: ["Low", "Medium", "High"] },
  issueType: { type: String, enum: ["Pothole", "Road Damage", "Traffic Light Issue", "Sign Problem", "Debris on Road", "Other"], default: "Other" },
  status: { type: String, enum: ["pending", "verified", "solved"], default: "pending" },
  maintainance_team: { type: String, default: "Unassigned" },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Report", reportSchema);