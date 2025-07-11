const mongoose=require("mongoose");
function connectDB(){
    console.log('Connecting to:', process.env.DATABASE);

    mongoose.connect(process.env.DATABASE)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));
}

exports.connectDB = connectDB;