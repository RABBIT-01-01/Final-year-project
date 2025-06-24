const Report = require("../models/report.model");

exports.createReport = async (req, res, next) => {
    try {
        const { title, description, image, location, type } = req.body;
        const report = new Report({
            title,
            description,
            image,
            location,
            type,
            reportedBy: req.user._id // Assuming req.user is populated with the authenticated user's info
        });

        await report.save();
        res.status(201).json({ message: "Report created successfully", report });
    } catch (error) {
        next(error);
    }
}

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
        const report = await Report.findById(req.params.id).populate("reportedBy", "fullname email");
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
        const { title, description, image, location, type } = req.body;
        const report = await Report.findByIdAndUpdate(req.params.id, {
            title,
            description,
            image,
            location,
            type
        }, { new: true });

        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }
        res.status(200).json({ message: "Report updated successfully", report });
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