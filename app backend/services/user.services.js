const userModel = require('../models/user.model');
module.exports.createUser= async({
    firstname,lastname,email,logUser,password
})=>{
    
    if (!firstname || !email || !logUser || !password){
        throw new Error("all field required");

    }
    const user =userModel.create({
        fullname:{
            firstname,
            lastname
        },
        email,
        logUser,
        password
    })
    return user;
}