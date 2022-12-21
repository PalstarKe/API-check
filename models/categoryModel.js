const mongoose=require('mongoose');
const CategorySchema = new mongoose.Schema({
	slug:String,
 	name: String 
},{
	timestamps:true
});

const Category = mongoose.model('Category', CategorySchema);
module.exports = Category
