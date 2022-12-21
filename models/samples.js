const mongoose=require('mongoose');

const SampleSchema = new mongoose.Schema(
{
    sample_title: {
        type: String,
        required: [true, 'Title required'],
    },
    sample_meta_title: {
        type:String,
        required: true,
    },
    sample_meta_description: {
        type: String,
        required: true,
    },
    sample_keywords: {
        type: String,
        required: true,
    },
    paper_instructions: {
        type: String,
        required: true,
    },
    sample_file: {
        type:String,
        default:null
    },
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
SampleSchema.virtual('file_url').get(function() {
    var fullUrl = req.protocol + '://' + req.get('host');
    return fullUrl+'/uploads/samples/'+this.file;
  });

  
const Sample = mongoose.model('Sample',SampleSchema);
module.exports = Sample;