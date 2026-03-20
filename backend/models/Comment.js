const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true,
    },
    comment: {
        type:String,
        required:true,
        trim:true,
    },
    postId: {
        required:true,
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post',
    },
},
{
    timestamps:true,
}
)
module.exports = mongoose.model('Comment',commentSchema);