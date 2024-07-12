const postDb=require("../model/postModel")
const {postSchema,editpostSchema}=require("../../validators/allValidator")
const commonfunction = require("../../middlewares/fileUpload")
const Joi = require("joi");

exports.createPost = async (req, res) => {
    try {
        //   let { email, password } = req.body;
        const { error } = postSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                status: 0,
                message: error.details[0].message
            });
        } else {
            const exist = await postDb.exists({ title: req.body.title });
            if (exist) {
                return res
                    .status(400)
                    .json({ message: "This subject is already taken!" });
            }
            let postImage;
            if (req.file) {
                postImage = req.file.path;
                postImage = await commonfunction.uploadImage(postImage);
            }
            const result = await postDb.create({
                userId:req.user._id,
                title:req.body.title,
                postDate:new Date(),
                postImage:postImage || '',
                body:req.body.body,
                // location:req.body.location
            });
            return res.status(200).json({
                status: 1,
                message: "post Create sucessfully",
                result
            });
        }
    } catch (err) {
        return res.status(500).json({
            status: 0,
            message: err.toString(),
        });
    }
};
exports.addCoordinates = async (req, res) => {
  try {
    const { body } = req;
    const { error } = Joi.object()
      .keys({
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
      })
      .required()
      .validate(body);
    if (error) {
      return res
        .status(400)
        .send({ success: false, error: error.details[0].message });
    }
    let location = {
      type: "Point",
      coordinates: [req.body.latitude, req.body.longitude],
    };

    let result = await postDb.findByIdAndUpdate(
      { _id: req.params.id },
      {
        location,
      },
      { new: true }
    );
    if (!result) {
      return res.status(404).json({
        status: 0,
        message: "No Data Found",
      });
    } else {
      return res.status(200).json({
        status: 1,
        message: "User coordinates Updated Successfully",
        result: result.location,
      });
    }
  } catch (e) {
    return res.status(500).json({
      status: 0,
      message: "Something went wong",
      error: e.toString(),
    });
  }
};
exports.updatePost = async (req, res) => {
    try {
        //   let { email, password } = req.body;
        const { error } = editpostSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                status: 0,
                message: error.details[0].message
            });
        } else {
        
            let postImage;
            if (req.file) {
                postImage = req.file.path;
                postImage = await commonfunction.uploadImage(postImage);
            }
            const result = await postDb.findByIdAndUpdate(req.params.id,{
                title:req.body.title,
                postImage:postImage || '',
                body:req.body.body
            },{new:true});
            return res.status(200).json({
                status: 1,
                message: "post Update sucessfully",
                result
            });
        }
    } catch (err) {
        return res.status(500).json({
            status: 0,
            message: err.toString(),
        });
    }
};
exports.deletePost=async(req,res)=>{
    try {
        const result=await postDb.findByIdAndDelete(req.params.id)
        if (!result) {
            return res.status(404).json({
                status:0,
                message:"Data Not Founded"
            })
        } else {
            return res.status(200).json({
                status:1,
                message:"Data Deleted Successfully",
                result
            }) 
        }
    } catch (error) {
        return res.status(500).json({
            status:0,
            message:error.toString()
        }) 
    }
}
exports.postActiveCount = async (req, res) => {
    try {
        const result = await postDb.find({status:"Active"})
        if (!result) {
            return res.status(404).json({
                status: 0,
                message: "Data Not Founded"
            })
        } else {
            return res.status(200).json({
                status: 1,
                message: "Data Founded Successfully",
                result:result.length
            })
        }
    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.message
        })
    }
}

exports.postInactiveCount = async (req, res) => {
    try {
        const result = await postDb.find({status:"Inactive"})
        if (!result) {
            return res.status(404).json({
                status: 0,
                message: "Data Not Founded"
            })
        } else {
            return res.status(200).json({
                status: 1,
                message: "Data Founded Successfully",
                result:result.length
            })
        }
    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.message
        })
    }
}
