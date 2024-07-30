const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email:{
        type: String,
        require: true,
        unique: true
    },

    password:{
        type: String,
        require: true
    },

    firstname:{
        type: String,
        require: true
    },

    lastname:{
        type: String,
        require: true
    },

    createAt: {
        type: Date,
        default: Date.now
    },

    refreshToken:{
        type: String,
        default: null
    }
})

module.exports = mongoose.model('Users', UserSchema);
