const Joi = require("joi");
const userSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name : Joi.string().required(),
    dob : Joi.string().required(),
    phone : Joi.string().required(),
    gender : Joi.string().required(),
    address : Joi.string().required(),
  });
  const userLogin = Joi.object({
    email: Joi.string().email(),
    phone : Joi.string(),
    password: Joi.string().required()
  });
  const userEditSchema = Joi.object({
    email: Joi.string().email(),
    name : Joi.string(),
    phone : Joi.string(),
    gender : Joi.string(),
    address : Joi.string(),
  });
  const postSchema = Joi.object({
    body: Joi.string().required(),
    postImage: Joi.string(),
    title : Joi.string().required(),
  
  });
  const editpostSchema = Joi.object({
    body: Joi.string(),
    postImage: Joi.string(),
    title : Joi.string(),
  });
  module.exports = {
    userSchema,userLogin,userEditSchema,postSchema,editpostSchema
  };