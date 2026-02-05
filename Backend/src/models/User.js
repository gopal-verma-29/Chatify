// models/user.js
import mongoose from "mongoose";

const Schema = mongoose.Schema;
const userSchema = new Schema({
fullName:{
    type: String,
    required: true,
},
email:{
    type: String,
    required: true,
    unique: true
},
password:{
    type: String,
    required: true,
},
profilPic:{
    type: String,
    default: ""
}
},
{ timestamps: true } //createdAt updatedAt
);

// Important: export the model with module.exports
const User = mongoose.model("User", userSchema);
export default User;