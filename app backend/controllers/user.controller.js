const userModel = require('../models/user.model');
const userService = require('../services/user.services');
const {validationResult} =require('express-validator');
const bcrypt = require('bcryptjs');

module.exports.registerUser= async (req, res,next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ errors: error.array() });
    }

    const { fullname, email,phone, logUser, password ,maintenance_team} = req.body;

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
        password:hashedPassword,
        maintenance_team
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

module.exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await userModel.find();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
}

module.exports.deleteUser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const user = await userModel.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        next(error);
    }
}

// module.exports.updateUser = async (req, res, next) => {
//     try {
//         const userId = req.params.id;
//         const updates = req.body;
//         console.log(updates);
//         if (updates.password){
//         updates.password = await userModel.hashPassword(updates.password);}
//         const user = await userModel
//             .findByIdAndUpdate(userId, updates, { new: true });
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }
//         res.status(200).json(user);
//     } catch (error) {
//         next(error);
//     }
// }


module.exports.updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const updates = { ...req.body };

    // If password is being updated, hash it first
    if (updates.password) {
      updates.password = await userModel.hashPassword(updates.password);
    }

    // Update user
    const user = await userModel.findByIdAndUpdate(userId, updates, { new: true });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Do not return password in response
    const userObj = user.toObject();
    delete userObj.password;

    res.status(200).json(userObj);
  } catch (error) {
    next(error);
  }
};
