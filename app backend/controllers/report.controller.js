const Report = require("../models/report.model");

// const Report = require("../models/report.model");

// Create a new report
exports.createReport = async (req, res) => {
  try {
    const {
      description,
      image,
      location,
      coordinates,
      severityLevel,
      type,
      status
    } = req.body;

    const report = new Report({
      description,
      image,
      location,
      coordinates,
      severityLevel,
      type,
      status
    });
    const savedReport = await report.save();
    res.status(201).json(savedReport);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllReports = async (req, res, next) => {
    try {
        const reports = await Report.find().populate("reportedBy", "fullname email");
        res.status(200).json(reports);
    } catch (error) {
        next(error);
    }
}

exports.getReportById = async (req, res, next) => {
    try {
        // console.log(req.params.id);
        const userId = req.params.id;
        console.log(userId);
        const report = await Report.find({ reportedBy: userId }).populate("reportedBy", "fullname email");
        // console.log(report);
        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }
        res.status(200).json(report);
    } catch (error) {
        next(error);
    }
}

exports.updateReport = async (req, res, next) => {
    try {
        const {
            description,
            image,
            location,
            coordinates,
            severityLevel,
            type,
            status
        } = req.body;

        const updatedReport = await Report.findByIdAndUpdate(
            req.params.id,
            {
                description,
                image,
                location,
                coordinates,
                severityLevel,
                type,
                status
            },
            { new: true, runValidators: true }
        );

        if (!updatedReport) {
            return res.status(404).json({ message: "Report not found" });
        }
        res.status(200).json({ message: "Report updated successfully", report: updatedReport });
    } catch (error) {
        next(error);
    }
}

exports.deleteReport = async (req, res, next) => {
    try {
        const report = await Report.findByIdAndDelete(req.params.id);
        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }
        res.status(200).json({ message: "Report deleted successfully" });
    } catch (error) {
        next(error);
    }
}