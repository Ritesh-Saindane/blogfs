const { Schema, model } = require("mongoose");

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    coverImageUrl: {
      type: String,
      required: false,
    },
    coverText: {
      type: String,
      required: true,
    },
    noOfLikes: {
      type: [Schema.Types.ObjectId],
      ref: "blogUser",
      default: [],
    },
    noOfViews: {
      type: Number,
      default: 0,
    },
    noOfComment: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "blogUser",
    },
  },
  { timestamps: true }
);

const Blog = model("blog", blogSchema);

module.exports = Blog;
