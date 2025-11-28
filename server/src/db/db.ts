import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

//user datas
const user = new Schema({
    email: {type: String, unique: true},
    name: String,
    password: String,
    githubId: String,
    //array of projects
    projects: [{link:String}]
});

const UserModel = mongoose.model("user", user);

module.exports = {
    UserModel
};