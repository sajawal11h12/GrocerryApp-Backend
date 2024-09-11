const mongoose=require("mongoose");

const UserDetailSchema= new mongoose.Schema({
    name:String,
    email:{type:String, unique: true},
    phone:String,
    password:String,
},
{
collection:"Userinfo"
}


)

module.exports = mongoose.model("Userinfo", UserDetailSchema);