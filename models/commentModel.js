const mongoose=require('mongoose');
const bcrypt=require('bcrypt');

const CommentSchema = new mongoose.Schema({
	comment:String,
	blog_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog' },
	user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
},{
    timestamps:true,
});


const Comment = mongoose.model('Comment', CommentSchema);
module.exports = Comment;