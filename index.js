const express = require("express");
const app = express();
const port = 5000;
const path = require("path");
const bcrypt = require("bcrypt");
const { password } = require("pg/lib/defaults");
const { where } = require("sequelize");
var session = require("express-session");
const cookie = require("express-session/session/cookie");
const flash = require("express-flash");

// const config = require("./config/config");
// const { Sequelize, QueryTypes, where } = require("sequelize");
// const { start } = require("repl");
// const sequelize = new Sequelize(config.development);

const blogModel = require("./models").blogs;
const userModel = require("./models").User;

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "./views"));

app.use("/assets", express.static(path.join(__dirname, "./assets")));
app.use("/img", express.static(path.join(__dirname, "./img")));

app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    name: "my-session",
    secret: "eHNXzdUyXT",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);
app.use(flash());

const blogs = [];
app.post("/register", addRegister);
app.get("/register", renderRegister);
app.post("/login", addLogin);
app.get("/login", renderlogin);
app.get("/", index);
app.get("/blog", blog);
app.get("/testimonial", testimonial);
app.get("/contact", contact);
app.get("/detail/:blog_id", Detail);
app.post("/blog", addBlog);
app.get("/edit-blog/:blog_id", renderEditBlog);
app.post("/edit-blog/:blog_id", editBlog);
app.get("/delete-blog/:blog_id", deleteBlog);

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      req.flash("error", "Terjadi kesalahan. Silakan coba lagi.");
      return res.redirect("/");
    }
    res.redirect("/login");
  });
});

async function addRegister(req, res) {
  try {
    const { name, email, password } = req.body;
    const saltRounds = 10;
    const hasheadPassword = await bcrypt.hash(password, saltRounds);
    await userModel.create({
      name: name,
      email: email,
      password: hasheadPassword,
    });
    req.flash("succes", "Register berhasil!");
    res.redirect("/login");
  } catch (error) {
    req.flash("error", "nama nya udah di pake bro!");
    res.redirect("/register");
  }
}
function renderRegister(req, res) {
  res.render("register");
}
function renderlogin(req, res) {
  res.render("login");
}

async function addLogin(req, res) {
  try {
    const { email, password } = req.body;
    // cek email user apakah ada di database
    const user = await userModel.findOne({
      where: {
        email: email,
      },
    });
    if (!user) {
      req.flash("error", "email / password salah!");
      return res.redirect("/login");
    }

    // cek password apakah valid dengan password yang sudah di hash
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      req.flash("error", "email / password salah!");
      return res.redirect("/login");
    }

    req.session.user = user;
    req.flash("succes", "Berhasil Login");
    res.redirect("/");
  } catch (error) {
    req.flash("error", "something wrong");
    res.redirect("/");
  }
}

async function deleteBlog(req, res) {
  const { blog_id } = req.params;

  let result = await blogModel.findOne({
    where: {
      id: blog_id,
    },
  });

  if (!result) return res.render("not-found");

  await blogModel.destroy({
    where: {
      id: blog_id,
    },
  });
  res.redirect("/");
  // const id = req.params.blog_id;
  // const index = blogs.findIndex((blog) => blog.id == id);
  // blogs.splice(index, 1);
  // res.redirect("/");
}
async function editBlog(req, res) {
  const { blog_id } = req.params;
  const { title, content, startDate, endDate, nodeJs, reactJs, php, java } = req.body;

  const blog = await blogModel.findOne({
    where: {
      id: blog_id,
    },
  });

  if (!blog) return res.render("not-found");

  blog.title = title;
  blog.content = content;
  blog.start_date = startDate;
  blog.end_date = endDate;
  blog.node_js = nodeJs;
  blog.react_js = reactJs;
  blog.php = php;
  blog.java = java;
  blog.author = "rifki yudha";

  await blog.save();

  res.redirect("/");
  // const id = req.params.blog_id;
  // const newBlog = {
  //   id: id,
  //   title: req.body.title,
  //   startDate: req.body.startDate,
  //   endDate: req.body.endDate,
  //   content: req.body.content,
  //   nodeJs: req.body.nodeJs,
  //   reactJs: req.body.reactJs,
  //   php: req.body.php,
  //   java: req.body.java,
  //   createdAt: new Date(),
  //   author: "rifki yudha",
  //   image: "https://th.bing.com/th/id/OIP.3z76z4KZtcQOww5gkqeeMgHaFz?rs=1&pid=ImgDetMain",
  // };
  // const index = blogs.findIndex((blog) => blog.id == id);
  // blogs[index] = newBlog;
  // res.redirect("/");
}
async function renderEditBlog(req, res) {
  const { blog_id } = req.params;

  const result = await blogModel.findOne({
    where: {
      id: blog_id,
    },
  });

  if (!result) return res.render("not-found");

  res.render("edit-blog", { data: result });
  // const id = req.params.blog_id;
  // const blog = blogs.find((blog) => blog.id == id);

  // res.render("edit-blog", {
  //   data: blog,
  // });
}
async function addBlog(req, res) {
  const { title, content, startDate, endDate, nodeJs, reactJs, php, java } = req.body;
  await blogModel.create({
    title: title,
    content: content,
    start_date: startDate,
    end_date: endDate,
    node_js: nodeJs,
    react_js: reactJs,
    php: php,
    java: java,
    author: "rifki yudha",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPeWWU4427WFoUfLn-QiJGLoiIllli8ez1Tw&s",
  });
  // const blog = {
  //   id: blogs.length + 1,
  //   title: req.body.title,
  //   startDate: req.body.startDate,
  //   endDate: req.body.endDate,
  //   content: req.body.content,
  //   nodeJs: req.body.nodeJs,
  //   reactJs: req.body.reactJs,
  //   php: req.body.php,
  //   java: req.body.java,
  //   createdAt: new Date(),
  //   author: "rifki yudha",
  //   image: "https://th.bing.com/th/id/OIP.3z76z4KZtcQOww5gkqeeMgHaFz?rs=1&pid=ImgDetMain",
  // };

  res.redirect("/");
}
async function index(req, res) {
  // const result = await blogModel.findAll();
  const user = req.session.user;

  res.render("index", { user });
}
function blog(req, res) {
  res.render("blog");
}
function testimonial(req, res) {
  res.render("testimonial");
}
function contact(req, res) {
  res.render("contact");
}
// async function detail(req, res) {
//   const id = req.params.blog_id;
//   const result = await blogModel.findOne({
//     where: {
//       id: id,
//     },
//   });
//   console.log("detail", result);
//   if (!result) return res.render("not-found");
//   res.render("detail", { data: result });
//   // const blog = blogs.find((blog) => blog.id == id);
//   // res.render("detail", {
//   //   data: blog,
//   // });
// }
async function Detail(req, res) {
  const { blog_id } = req.params;
  const result = await blogModel.findOne({
    where: {
      id: blog_id,
    },
  });

  console.log("detail", result);

  if (!result) return res.render("not-found");
  res.render("detail", { data: result });
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
