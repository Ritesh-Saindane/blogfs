const { Router } = require("express");
const multer = require("multer");
const Blog = require("../models/blog");
const Comment = require("../models/comments");
const path = require("path");
const { strictValidation } = require("../middlewares/auth");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `./public/uploads/`);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()} - ${file.originalname}`);
  },
});

const uploads = multer({ storage });

const router = Router();

router.get("/add-blog", strictValidation("token"), async (req, res) => {
  res.render("addBlog", { userDetails: req.user });
});

router.post("/add-blog", uploads.single("coverImage"), async (req, res) => {
  let { title, body, coverText } = req.body;
  const createdBlog = await Blog.create({
    title,
    body,
    coverText,
    createdBy: req.user._id,
    coverImageUrl: `/uploads/${req.file.filename}`,
  });
  return res.redirect(`/blog/${createdBlog._id}`);
});

router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        $inc: { noOfViews: 1 },
      },
      { new: true }
    ).populate("createdBy");

    const comments = await Comment.find({ blogId: req.params.id })
      .populate("createdBy")
      .sort({ createdAt: -1 });

    // console.log(comments);
    res.render("blogPage", {
      userDetails: req.user,
      blog,
      comments,
    });
  } catch (err) {
    res.send("OOPS");
  }
});

router.post("/comments/:id", strictValidation("token"), async (req, res) => {
  const comments = await Comment.create({
    content: req.body.content,
    createdBy: req.user._id,
    blogId: req.params.id,
  });

  res.redirect(`/blog/${req.params.id}`);
});

router.post("/like/:id", strictValidation("token"), async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (blog.noOfLikes.includes(req.user._id)) {
    blog.noOfLikes.pull(req.user._id);
  } else blog.noOfLikes.push(req.user._id);

  await blog.save();

  res.redirect(`/blog/${blog._id}`);
});

module.exports = router;
