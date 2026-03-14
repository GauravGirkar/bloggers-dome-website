const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true,
    },
    username:{
        type: String,
        required: true,
        trim: true,
        unique:true,
    },
    age:{
        type: Number,
        required: false,
    },
    contact:{
        type: String,
        required: false,
        trim: true,
    },
    email:{
        type: String,
        unique:true,
        required: true,
        trim: true,
    },
    password:{
        type: String,
        required: true,
        trim: true,
    },
    country:{
        type: String,
        required: false,
        trim: true,
    },
    bio:{
        type: String,
        trim: true,
    },
    gender:{
        type: String,
        trim: true,
    },
    profile_pic:{
        type: String,
        default:"https://static.vecteezy.com/system/resources/previews/013/360/247/non_2x/default-avatar-photo-icon-social-media-profile-sign-symbol-vector.jpg",
    },

},
 { timestamps: true });

 module.exports = mongoose.model('User', userSchema);