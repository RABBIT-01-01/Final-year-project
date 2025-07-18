const userModel = require('../models/user.model');
const userService = require('../services/user.services');
const {validationResult} =require('express-validator');

module.exports.registerUser= async (req, res,next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ errors: error.array() });
    }

    const { fullname, email,phone, logUser, password } = req.body;

    const isUserAlready = await userModel.findOne({ email });
    const isPhoneAlready = await userModel.findOne({ phone });
    if (isPhoneAlready){
        return res.status(400).json({ message: 'phone number already registered' });
    }
    if (isUserAlready) {
        return res.status(400).json({ message: 'email already registered' });
    }
    const hashedPassword = await userModel.hashPassword(password);

    const user = await userService.createUser({
        fullname,
        email,
        phone,
        logUser,
        password:hashedPassword
    });

const token = user.generateAuthToken();
res.cookie('token',token);
res.status(201).json({token,user});
}

module.exports.loginUser = async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ errors: error.array() });
    }
    const { email, password } = req.body;
    const user = await userModel.findOne({ email }).select('+password');
    if(!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }
    const isMatch = await user.comparePassword(password);
    if(!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }
    const token = user.generateAuthToken();
    res.cookie('token',token);
    res.status(200).json({ token, user });
}


module.exports.getUserProfile = async (req, res, next) => {
        res.status(200).json(req.user);
}

module.exports.logoutUser = async (req, res, next) => {
    res.clearCookie('token');
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    res.status(200).json({ message: 'User logged out successfully'});
}
