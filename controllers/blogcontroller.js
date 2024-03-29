const { Validator } = require('node-input-validator');
const Blog = require('../models/blog');
const Category = require('../models/categoryModel');
const mongoose=require('mongoose');
const fs=require('fs');


exports.list = async (req,res) => {

    try {
        let query = [
            {
                $lookup:
                {
                    from : "users",
                    localField: "created_by",
                    foreignField: "_id",
                    as : "creator"
                }
            },
            {$unwind : '$creator'},
            {
                $lookup:
                {
                    from : "categories",
                    localField: "category",
                    foreignField: "_id",
                    as : "category_details"
                }
            },
            {$unwind : '$category_details'},
        ];
    
        // localhost:3031/blogs?keyword=ttttt2
        if(req.query.keyword && req.query.keyword!= ''){
            query.push({
                $match: {
                    $or :[
                        {
                            'creator.first_name' : {$regex : req.query.keyword} 
                        },
                        {
                            'category_details.name' : {$regex : req.query.keyword}
                        },
                        {
                            title : {$regex : req.query.keyword}
                        }
                    ]
                }
            });
        }
    
        //localhost:3031/blogs?keyword=ttttt2&&category=sport
        if(req.query.category && req.query.category!= ''){
            query.push({
                $match: {
                    $or :[
                        {
                            'category_details.slug' : {$regex : req.query.category}
                        },
                    ]
                }
            });
        }
    
        // filter the data by user 
        // localhost:3031/blogs?user_id=633de61f01b009e30a1ac37a
        if(req.query.user_id && req.query.user_id!= ''){
            query.push({
                $match: {
                    created_by : mongoose.Types.ObjectId(req.query.user_id),
                }
            });
        }
    
    
        // first page 0 ,second skip 10 , third skip 20
        // let total = await Blog.countDocuments(query);
        // let page = (req.query.page)?parseInt(req.query.page):1;
        // let perPage = (req.query.perPage)?parseInt(req.query.perPage):10;
        // let skip = (page-1)*perPage; 
        // query.push({
        //     $skip:skip,
        // });
        // query.push({
        //     $limit:perPage,
        // });
    
    
        //localhost:3031/blogs?sortBy=title&&sortOrder=asc
        if(req.query.sortBy && req.query.sortOrder){
            var sort = {};
            sort[req.query.sortBy] = (req.query.sortOrder == 'asc')?1:-1;
            query.push({
                $sort : sort
            });
        }else{
            // default sort
            query.push({
                $sort : {createdAt:-1}
            });
        }
    
    
        let blogs = await Blog.aggregate(query);
        return res.send({
            message : 'Blog successfully fetched',
            data:{
                //blogs:blogs,
                blogs:blogs.map(doc=> Blog.hydrate(doc)), 
            }
        });
    }catch(err) {
        return res.status(400).send({
            message:err.message,
            data:err
        });
    }

}

// get specific blog
exports.specificBlog = async (req,res)=> {
    try{

        let blog_id = req.query.blog_id;
        let blog = await Blog.findOne({_id:blog_id})
        .populate('category')
        .populate('created_by')
        .populate('blog_comments');
        
        return res.send({
            message : 'Blog successfully fetched',
            data:{
                blog:blog, 
            }
        });


    }catch(err){ 
        return res.status(400).send({
            message:err.message,
            data:err
        });
    }
};

exports.create = async (req,res)=>{
    
    if(req.files && req.files.image){
        req.body['image']=req.files.image;
    }
    
    const v = new Validator(req.body, {
        title:'required|minLength:5|maxLength:100',
        short_description : 'required',
        description:'required',
        category:'required',
        image:'required|mime:jpg.jpeg,png'
    });

    const matched = await v.check();
    if(!matched){
        return res.status(422).send(v.errors);
    }  
    
    try{
        if(req.files && req.files.image){
            var image_file= req.files.image;
            var image_file_name=Date.now()+'-blog-image-'+image_file.name;
            var image_path=publicPath+'/uploads/blog_images/'+image_file_name;
            await image_file.mv(image_path);
		}

        const newBlog = new Blog({
            title:req.body.title,
            short_description:req.body.short_description,
            description:req.body.description,
            category:req.body.category,
            created_by:req.user._id,
            image:image_file_name
        });

        let blogData = await newBlog.save();
        let populatedData = await Blog.findOne({_id:blogData._id})
        .populate('category')
        .populate('created_by');
        

        return res.status(201).send({
            message:'Blog Created Successfully',
            data:{
                blog:populatedData
            }
        });

    }catch(err){
        return res.status(400).send({
            message:err.message,
            data:err
        });
    }

}

exports.update = async (req,res) =>{
    let blog_id =req.body.blog_id;

    if(!mongoose.Types.ObjectId.isValid(blog_id)){
		return res.status(400).send({
	  		message:'Invalid blog id',
	  		data:{}
	  	});
	}

    Blog.findOne({_id:blog_id}).then(async(blog)=>{
        if(!blog){
            return res.status(400).send({
                message:'No blog found',
                data:{}
            });
        }else{
            let current_user = req.user;

            if(blog.created_by != current_user._id){
                return res.status(400).send({
                    message:'Access Denied',
                    data:{}
                });
            }else{

                let rules = {
                    title:'required|minLength:5|maxLength:100',
                    short_description : 'required',
                    description:'required',
                    category:'required'
                }
                
                try{
                    if(req.files && req.files.image){
                        req.body['image']=req.files.image;
                        rules['image'] = 'required|mime:jpg.jpeg,png'
                    }
                    
                    const v = new Validator(req.body, rules);
                
                    const matched = await v.check();
                    if(!matched){ 
                        return res.status(422).send(v.errors);
                    } 

                    if(req.files && req.files.image){
                        var image_file= req.files.image;
                        var image_file_name=Date.now()+'-blog-image-'+image_file.name;
                        var image_path=publicPath+'/uploads/blog_images/'+image_file_name;
                        await image_file.mv(image_path);

                        let old_path = publicPath+'/uploads/blog_images/'+blog.image;
                        if(fs.existsSync(old_path)){
                            fs.unlinkSync(old_path);
                        }
                    }else{
                        var image_file_name = blog.image;
                    }

                    await Blog.updateOne({_id:blog_id},{
                        title:req.body.title,
                        short_description:req.body.short_description,
                        description:req.body.description,
                        category:req.body.category,
                        image:image_file_name
                    });

                    let updateBblog = await Blog.findOne({_id:blog_id})
                    .populate('category')
                    .populate('created_by');

                    return res.status(200).send({
                        message:'Blog Successfully Updated ',
                        data:{
                            blog:updateBblog
                        }
                    });

                }catch(err){
                    return res.status(400).send({
                        message:err.message,
                        data:err
                    });
                }
            }
        }
    }).catch((err)=>{
        return res.status(400).send({
            message:err.message,
            data:err
        });
    });
}

exports.delete=async (req,res)=>{
	let blog_id=req.body.blog_id;
	if(!mongoose.Types.ObjectId.isValid(blog_id)){
		return res.status(400).send({
	  		message:'Invalid blog id',
	  		data:{}
	  	});
	}

	Blog.findOne({_id:blog_id}).then(async (blog)=>{
		if(!blog){
			return res.status(400).send({
		  		message:'No blog found',
		  		data:{}
		  	});
		}else{
			let current_user=req.user;
			if(blog.created_by!=current_user._id){
				return res.status(400).send({
			  		message:'Access denied',
			  		data:{}
			  	});
			}else{

				let old_path=publicPath+'/uploads/blog_images/'+blog.image;
				if(fs.existsSync(old_path)){
					fs.unlinkSync(old_path);
				}

				await Blog.deleteOne({_id:blog_id});
				return res.status(200).send({
			  		message:'Blog successfully deleted',
			  		data:{}
			  	});
			}

		}
	}).catch((err)=>{
		return res.status(400).send({
	  		message:err.message,
	  		data:err
	  	});
	})
}