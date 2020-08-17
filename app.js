const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const _ = require("lodash");
const mongoose = require("mongoose");
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
const items = [];
mongoose
  .connect("mongodb+srv://zaid:Zaedzaed12@cluster0.3nbpg.mongodb.net/post", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("mongoDB connected"))
  .catch((err) => console.log(err));
const postsSchema = new mongoose.Schema({title: String, content: String});
const posts = mongoose.model("post", postsSchema);

app.get("/", (req, res) => {
  posts.find({}, (err, foundPosts) => {
    if (foundPosts.length !== 0) {
      if (err) {
        console.log("error line 23", err.message);
        res.render("laoding");
      } else {
        console.log("successful");
        res.render("index", {items: foundPosts});
      }
    }
  });
  // console.log(posts.find({title}));
});

app.get("/post", (req, res) => {
  res.render("post");
});

app.post("/post", (req, res) => {
  const title = req.body.title;
  const content = req.body.content;

  const post = new posts({
    title,
    content,
  });
  post.save();
  res.redirect("/");
});

app.get("/posts/:title", (req, res) => {
  posts.findOne({title: req.params.title}, (err, foundPosts) => {
    var requstedTilte = _.kebabCase(req.params.title);
    var reqTitel = _.upperFirst(requstedTilte);
    console.log(foundPosts.title);
    if (foundPosts.length !== 0) {
      if (err) {
        console.log("Error", err);
      } else {
        //i still have a problem here
        const postTitle = _.kebabCase(foundPosts.title);
        const postTil = _.upperFirst(postTitle);
        console.log(postTil);
        if (postTil === reqTitel) {
          console.log("true");
          res.render("posts", {foundPosts: foundPosts});
        }
      }
    }
  });
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
