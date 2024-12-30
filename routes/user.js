const { Router } = require("express");
const User = require("../models/user");
const Blog = require("../models/blog");
const multer = require("multer");
const { strictValidation } = require("../middlewares/auth");

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()} - ${file.originalname}`);
  },
});

const uploads = multer({ storage });

router.get("/signin", (req, res) => {
  res.render("signin");
});

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup", uploads.single("profileImage"), async (req, res) => {
  let { fullName, email, password } = req.body;
  try {
    await User.create({
      fullName,
      email,
      password,
      profileImageUrl: `/images/${req.file.filename}`,
    });
    return res.redirect("/user/signin");
  } catch (e) {
    res.render("signup", { error: e.message });
  }
});

router.post("/signin", async (req, res) => {
  let { email, password } = req.body;
  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);
    res.cookie("token", token);
    return res.redirect("/");
  } catch (error) {
    return res.render("signin", { error: error.message });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("/");
});

router.get("/profile/:userId", strictValidation("token"), async (req, res) => {
  // console.log(req.user);
  let userDetails = await User.findById(req.params.userId);
  let BlogDetails = await Blog.find({ createdBy: req.params.userId });
  const totalViews = BlogDetails.reduce((sum, blog) => sum + blog.noOfViews, 0);
  const totalLikes = BlogDetails.reduce(
    (sum, blog) => sum + blog.noOfLikes.length,
    0
  );
  return res.render("profilePage", {
    userDetails: req.user,
    user: userDetails,
    blogs: BlogDetails,
    totalViews,
    totalLikes,
  });
});

module.exports = router;
