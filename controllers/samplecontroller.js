const { Validator } = require('node-input-validator');
const Sample = require('../models/samples');
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
                    foreignField: "_id",
                    as : "sample_details"
                }
            },
            {$unwind : '$sample_details'},
        ];
    
        // localhost:3031/samples?keyword=ttttt2
        if(req.query.keyword && req.query.keyword!= ''){
            query.push({
                $match: {
                    $or :[
                        {
                            'creator.first_name' : {$regex : req.query.keyword} 
                        },
                        {
                            'sample_details.name' : {$regex : req.query.keyword}
                        },
                        {
                            title : {$regex : req.query.keyword}
                        }
                    ]
                }
            });
        }
    
        // filter the data by user 
        // localhost:3031/samples?user_id=633de61f01b009e30a1ac37a
        if(req.query.user_id && req.query.user_id!= ''){
            query.push({
                $match: {
                    created_by : mongoose.Types.ObjectId(req.query.user_id),
                }
            });
        }
    
    
        // first page 0 ,second skip 10 , third skip 20
        // let total = await sample.countDocuments(query);
        // let page = (req.query.page)?parseInt(req.query.page):1;
        // let perPage = (req.query.perPage)?parseInt(req.query.perPage):10;
        // let skip = (page-1)*perPage; 
        // query.push({
        //     $skip:skip,
        // });
        // query.push({
        //     $limit:perPage,
        // });
    
    
        //localhost:3031/sampless?sortBy=title&&sortOrder=asc
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
    
    
        let samples = await Sample.aggregate(query);
        return res.send({
            message : 'Samples successfully fetched',
            data:{
                //Samples:samples,
                samples:samples.map(doc=> Sample.hydrate(doc)), 
            }
        });
    }catch(err) {
        return res.status(400).send({
            message:err.message,
            data:err
        });
    }

}

// get specific sample
exports.specificSample = async (req,res)=> {
    try{

        let sample_id = req.query.sample_id;
        let sample = await Sample.findOne({_id:sample_id})
        .populate('created_by')
        
        return res.send({
            message : 'Sample successfully fetched',
            data:{
                sample:sample, 
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
    
    if(req.files && req.files.file){
        req.body['file']=req.files.file;
    }
    
    const v = new Validator(req.body, {
        sample_title:'required|minLength:5|maxLength:100',
        sample_meta_description : 'required',
        paper_instruction:'required',
        file:'required|mime:pdf'
    });

    const matched = await v.check();
    if(!matched){
        return res.status(422).send(v.errors);
    }  
    
    try{
        if(req.files && req.files.file){
            var file_file= req.files.file;
            var file_file_name=Date.now()+'-sample-file-'+file_file.name;
            var file_path=publicPath+'/uploads/samples/'+file_file_name;
            await file_file.mv(file_path);
		}

        const newSample = new Sample({
            sample_title:req.body.sample_title,
            sample_meta_description:req.body.sample_meta_description,
            paper_instruction:req.body.paper_instruction,
            file:file_file_name
        });

        let sampleData = await newSample.save();
        let populatedData = await Sample.findOne({_id:sampleData._id})
        .populate('created_by');
        

        return res.status(201).send({
            message:'sample added Successfully',
            data:{
                sample:populatedData
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
    let sample_id =req.body.sample_id;

    if(!mongoose.Types.ObjectId.isValid(sample_id)){
		return res.status(400).send({
	  		message:'Invalid sample id',
	  		data:{}
	  	});
	}

    Sample.findOne({_id:sample_id}).then(async(sample)=>{
        if(!sample){
            return res.status(400).send({
                message:'No sample found',
                data:{}
            });
        }else{
            let current_user = req.user;

            if(sample.created_by != current_user._id){
                return res.status(400).send({
                    message:'Access Denied',
                    data:{}
                });
            }else{

                let rules = {
                    sample_title:'required|minLength:5|maxLength:100',
                    sample_meta_description : 'required',
                    sample_description:'required',
                    category:'required'
                }
                
                try{
                    if(req.files && req.files.file){
                        req.body['file']=req.files.file;
                        rules['file'] = 'required|mime:pdf'
                    }
                    
                    const v = new Validator(req.body, rules);
                
                    const matched = await v.check();
                    if(!matched){ 
                        return res.status(422).send(v.errors);
                    } 

                    if(req.files && req.files.file){
                        var sample_file= req.files.file;
                        var sample_file_name=Date.now()+'-sample-file-'+sample_file.name;
                        var sample_path=publicPath+'/uploads/samples/'+sample_file_name;
                        await sample_file.mv(sample_path);

                        let old_path = publicPath+'/uploads/samples/'+sample.file;
                        if(fs.existsSync(old_path)){
                            fs.unlinkSync(old_path);
                        }
                    }else{
                        var sample_file_name = sample.file;
                    }

                    await Sample.updateOne({_id:sample_id},{
                        title:req.body.title,
                        short_description:req.body.short_description,
                        description:req.body.description,
                        paper_instruction:req.body.paper_instruction,
                        file:sample_file_name
                    });

                    let updateSample = await Sample.findOne({_id:sample_id})
                    .populate('category')
                    .populate('created_by');

                    return res.status(200).send({
                        message:'Sample Successfully Updated ',
                        data:{
                            sample:updateSample
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
	let sample_id=req.body.sample_id;
	if(!mongoose.Types.ObjectId.isValid(sample_id)){
		return res.status(400).send({
	  		message:'Invalid sample id',
	  		data:{}
	  	});
	}

	Sample.findOne({_id:blog_id}).then(async (sample)=>{
		if(!sample){
			return res.status(400).send({
		  		message:'No sample found',
		  		data:{}
		  	});
		}else{
			let current_user=req.user;
			if(sample.created_by!=current_user._id){
				return res.status(400).send({
			  		message:'Access denied',
			  		data:{}
			  	});
			}else{

				let old_path=publicPath+'/uploads/samples/'+sample.file;
				if(fs.existsSync(old_path)){
					fs.unlinkSync(old_path);
				}

				await Sample.deleteOne({_id:sample_id});
				return res.status(200).send({
			  		message:'Sample successfully deleted',
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