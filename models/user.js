// we want email userid and password 
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },

});
// we have included email only here because userid and password will be automatically created by the line below
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);