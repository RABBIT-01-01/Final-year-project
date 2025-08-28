const Report = require("../models/report.model");

// Create a new report
exports.createReport = async (req, res, next) => {
  try {
    // Extract fields from req.body
    const {
      description,
      location,
      severityLevel,
      issueType,
      status,
    } = req.body;

    // Parse coordinates if sent as JSON string
    let coordinates = {};
    if (req.body.coordinates) {
      coordinates = typeof req.body.coordinates === 'string'
        ? JSON.parse(req.body.coordinates)
        : req.body.coordinates;
    }

    // Build image URL from multer upload
    const imageUrl = req.file
      ? `/uploads/reports/${req.file.filename}`
      : null;

    const report = new Report({
      description,
      location,
      coordinates,
      severityLevel,
      issueType,
      status,
      image: imageUrl,
      reportedBy: req.user._id // Set by auth middleware
    });

    console.log("Report data:", report);
    const savedReport = await report.save();
    res.status(201).json(savedReport);
  } catch (error) {
    next(error);
  }
};

// Retrieve all reports
exports.getAllReports = async (req, res, next) => {
  try {
    const reports = await Report.find()
      .populate("reportedBy", "fullname email");
    res.status(200).json(reports);
  } catch (error) {
    next(error);
  }
};

// Retrieve reports by user (or single report by ID)
exports.getReportById = async (req, res, next) => {
  try {
  //   const { id } = req.params;
  //   const report = await Report.findById(id)
  //     .populate("reportedBy", "fullname email");
  //   if (!report) {
  //     return res.status(404).json({ message: "Report not found" });
  //   }
  //   res.status(200).json(report);
  // } catch (error) {
  //   next(error);
  // }


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
};

exports.getReportsByTeam = async (req, res, next) => {
  try {
    const team = req.params.team;
    const reports = await Report.find({ maintenance_team: team })
      .populate("reportedBy", "fullname email");
    if (!reports || reports.length === 0) {
      return res.status(404).json({ message: "No reports found for this team" });
    }
    res.status(200).json(reports);
  } catch (error) {
    next(error);
  }
};  

// exports.getReportsByTeam = async (req, res) => {
//   try {
//     const { team } = req.params;
//     const reports = await Report.find({ maintenance_team: team });

//     if (!reports || reports.length === 0) {
//       return res.status(404).json({ message: `No reports found for team: ${team}` });
//     }

//     res.status(200).json(reports);
//   } catch (error) {
//     console.error('Error fetching reports by team:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };
// Update an existing report
exports.updateReport = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Parse coordinates if provided
    if (req.body.coordinates) {
      updateData.coordinates = typeof req.body.coordinates === 'string'
        ? JSON.parse(req.body.coordinates)
        : req.body.coordinates;
    }

    // If a new image was uploaded, update the image field
    if (req.file) {
      updateData.image = `/uploads/reports/${req.file.filename}`;
    }

    const updatedReport = await Report.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedReport) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json({ message: "Report updated successfully", report: updatedReport });
  } catch (error) {
    next(error);
  }
};

// Delete a report
exports.deleteReport = async (req, res, next) => {
  try {
    const { id } = req.params;
    const report = await Report.findByIdAndDelete(id);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    res.status(200).json({ message: "Report deleted successfully" });
  } catch (error) {
    next(error);
  }
};
