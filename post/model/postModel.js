const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const PostSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
    },
    body: {
      type: String,
    },
    postDate: {
      type: String,
    },
    postImage: {
        type: String,
      },
    status: {
      type: String,
      enum:["Active","Inactive"],
      default:"Active"
    },
    location: {
        type: {
          type: String,
          enum: ["Point"],
        },
        coordinates: {
          type: [Number],
        },
      },
  },
  { timestamps: true }
);
PostSchema.plugin(aggregatePaginate);
PostSchema.index({ location: "2dsphere" });
module.exports = mongoose.model("Post", PostSchema);