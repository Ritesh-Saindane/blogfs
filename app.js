require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const userRouter = require("./routes/user");
const { connect } = require("mongoose");
const cookieParser = require("cookie-parser");
const { checkForAuthenticationCookie } = require("./middlewares/auth");
const PORT = process.env.PORT || 8000;
const blogRoutes = require("./routes/blog");
const Blog = require("./models/blog");

connect(process.env.MONGO_DB_URL)
  .then(() => console.log("MongoDB Connected !"))
  .catch((e) => console.log(e));

app.use(express.static(path.resolve("./public")));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({}).populate("createdBy");
  // console.log(req.user);
  res.render("home", { userDetails: req.user, allBlogs });
});
app.use("/user", userRouter);
app.use("/blog", blogRoutes);

app.listen(PORT, () => console.log(`Server Started Working on PORT ${PORT}!`));
