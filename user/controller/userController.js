const userDb = require("../model/userModel");
const { userSchema, userLogin, userEditSchema, image } = require("../../validators/allValidator")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const postDb = require("../../post/model/postModel");
const Joi = require("joi");

exports.userSignup = async (req, res) => {
    try {
        //   let { email, password } = req.body;
        const { error } = userSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                status: 0,
                message: error.details[0].message
            });
        } else {
            const exist = await userDb.findOne({ email: req.body.email });
            if (exist) {
                return res
                    .status(400)
                    .json({ message: "This email is already taken!" });
            }
            const existData = await userDb.findOne({ phone: req.body.phone });
            if (existData) {
                return res
                    .status(400)
                    .json({ message: "This Phone is already taken!" });
            }
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const result = await userDb.create({
                name: req.body.name,
                dob: req.body.dob,
                email: req.body.email,
                phone: req.body.phone,
                gender: req.body.gender,
                address: req.body.address,
                password: hashedPassword,
            });

            return res.status(200).json({
                status: 1,
                message: "User Signup sucessfully",
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

exports.userLogin = async (req, res) => {
    try {
        const { error } = userLogin.validate(req.body);
        if (error) {
            return res.status(400).json({
                status: 0,
                message: error.details[0].message
            });
        } else {
            let userResult = await userDb.findOne({ $or: [{ email: req.body.email }, { phone: req.body.phone }] });
            if (!userResult) {
                return res.status(404).json({
                    status: 0,
                    message: "Data Not found",
                });
            } else {
                let passCheck = bcrypt.compareSync(
                    req.body.password,
                    userResult.password
                );
                if (passCheck == false) {
                    return res.status(401).json({
                        status: 0,
                        message: "Incorrect password.",
                    });
                } else {
                    let dataToken = {
                        _id: userResult._id,
                        isUser: userResult.isUser,
                    };
                    let token = jwt.sign(dataToken, "test1234", {
                        expiresIn: "30d",
                    });
                    return res.status(200).json({
                        status: 1,
                        message: "User Login Successfully.....",
                        result: userResult,
                        token,
                    });
                }
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 0,
            message: error.toString(),
        });
    }
};
exports.editProfile = async (req, res) => {
    try {
        const { error } = userEditSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                status: 0,
                message: error.details[0].message
            });
        } else {
            const result = await userDb.findById(req.user._id);
            if (!result) {
                return res.status(404).json({
                    status: 0,
                    message: "User Not Founded"
                })
            } else {
                const upadatedata = await userDb.findByIdAndUpdate(req.user._id, { $set: req.body }, { new: true })
                return res.status(200).json({
                    status: 1,
                    message: "Update Successfully",
                })
            }
        }
    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.toString()
        })
    }
}
exports.showProfile = async (req, res) => {
    try {
        const result = await userDb.findById(req.user._id)
        if (!result) {
            return res.status(404).json({
                status: 0,
                message: "User Not Founded"
            })
        } else {
            return res.status(200).json({
                status: 1,
                message: "User Data Founded",
                result
            })
        }
    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.message
        })
    }
}
exports.deleteUser = async (req, res) => {
    try {
        const result = await userDb.findByIdAndDelete(req.user._id)
        if (!result) {
            return res.status(404).json({
                status: 0,
                message: "User Not Founded"
            })
        } else {
            return res.status(200).json({
                status: 1,
                message: "User Data Deleted Successfully",
                result
            })
        }
    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.message
        })
    }
}

exports.userGetPostList = async (req, res) => {
    try {
        const result = await postDb.find().sort("-createdAt")
        if (!result) {
            return res.status(404).json({
                status: 0,
                message: "Data Not Founded"
            })
        } else {
            return res.status(200).json({
                status: 1,
                message: "Data Founded Successfully",
                result
            })
        }
    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.message
        })
    }
}

exports.findPostUseCoordinates = async (req, res) => {
    try {
        const { body } = req.body;
        let detailSchema = Joi.object({
            latitude: Joi.number(),
            longitude: Joi.number(),
        });
        let result = detailSchema.validate(body);
        const { value, error } = result;
        const IsValied = error == null;
        if (!IsValied) {
            return res.status(422).json({
                message: error.details[0].message,
            });
        }
        let userPost = await postDb.aggregate([
            {
                $geoNear: {
                    near: {
                        type: "Point",
                        coordinates: [
                            parseFloat(req.body.latitude),
                            parseFloat(req.body.longitude),
                        ],
                    },
                    spherical: true,
                    distanceField: "distance",
                    distanceMultiplier: 1 / 1000,
                    // minDistance: 500,
                    maxDistance: 50000,
                    // ! meter to km
                },
            },
        ]);
   
        if (!userPost[0]) {
            return res.status(404).json({
                status: 0,
                message: "Unable to find post",
            });
        } else {
            return res.status(200).json({
                status: 1,
                message: "Successfully featch post",
                result: userPost,
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.toString(),
        });
    }
};
