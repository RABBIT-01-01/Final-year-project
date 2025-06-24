const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    fullname: {
        firstname:{
            type: String,
            required: true,
            minlength:[3, 'First name must be at least 3 characters long'],
        },
        lastname:{
            type: String,
            minlength:[3, 'Last name must be at least 3 characters long'],
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: [5, 'Email must be at least 5 characters long'],
    },
    logUser: {
        type: String,
        required: true,
        enum: ['user', 'admin'], // Only allow 'user' or 'admin'
        default: 'user', // Default role is 'user'
    },
    password: {
        type: String,
        required: true,
        select:false, // Do not return password in queries
    },
    socketId: {
        type: String,
    },
})
 
userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
        expiresIn: '24h', // Token expires in 24 hour
    });
    return token;
}

userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.statics.hashPassword = async function(password) {
    return await bcrypt.hash(password, 10); // Hash the password with a salt rounds of 10
}

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;