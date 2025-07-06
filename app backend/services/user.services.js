const userModel = require('../models/user.model');
module.exports.createUser= async({
    fullname,email,phone,logUser,password
})=>{
    
    if (!fullname || !email || !phone || !logUser || !password){
        throw new Error("all field required");

    }
    const user =userModel.create({
        fullname,
        email,
        phone,
        logUser,
        password
    })
    return user;
}