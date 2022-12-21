const mongoose=require('mongoose');

const BlogSchema = new mongoose.Schema(
{
    blog_title: {
        type: String,
        required: [true, 'Title required'],
    },
    blog_meta_title: {
        type:String,
        required: true,
    },
    blog_meta_description: {
        type: String,
        required: true,
    },
    blog_keywords: {
        type: String,
        required: true,
    },
    blog_description: {
        type: String,
        required: true,
    },
    blog_image: {
        type:String,
        default:null,
    },
    blog_category: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category',
    },
    blog_created_by: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
    },
    blog_comments:[{
        type: mongoose.Schema.Types.ObjectId,
         ref: 'BlogComment',
    }],
},{
    timestamps:true,
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
});

// fullUrl= https :// 127.0.0.1:3031
BlogSchema.virtual('image_url').get(function() {
    var fullUrl = req.protocol + '://' + req.get('host');
    return fullUrl+'/uploads/blog_images/'+this.image;
  });

  
const Blog = mongoose.model('Blog',BlogSchema);
module.exports = Blog;