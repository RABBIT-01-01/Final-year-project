const userModel = require('../models/user.model');
module.exports.createUser= async({
    fullname,email,phone,logUser,password,maintenance_team
})=>{
    
    if (!fullname || !email || !phone || !logUser || !password){
        throw new Error("all field required");

    }
    const user =userModel.create({
        fullname,
        email,
        phone,
        logUser,
        password,
        maintenance_team
    })
    return user;
}

module.exports.updateUser= async(id,updateData)=>{
    const user = await userModel.findByIdAndUpdate(id,updateData,{new:true});
    return user;
}