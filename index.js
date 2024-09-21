const express = require("express");
const app = express();
const port = 5000;
const path = require("path");
const bcrypt = require("bcrypt");
const session = require("express-session");
const flash = require("express-flash");
const config = require("./config/config");
const { Sequelize, QueryTypes } = require("sequelize");
const sequelize = new Sequelize(config.development);
const upload = require("./middlewares/upload-file");
const { isDate, parseISO, differenceInDays, formatDistance } = require("date-fns");
const hbs = require("hbs");

// const { password } = require("pg/lib/defaults");
// const { where } = require("sequelize");
// const { start } = require("repl");
// const cookie = require("express-session/session/cookie");

const blogModel = require("./models").blogs;
const userModel = require("./models").User;

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "./views"));

hbs.registerHelper("eq", function (a, b) {
  return a === b;
});

app.use("/assets", express.static(path.join(__dirname, "./assets")));
app.use("/img", express.static(path.join(__dirname, "./img")));
app.use("/uploads", express.static(path.join(__dirname, "./uploads")));

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
app.post("/blog", upload.single("image"), addBlog);
app.get("/edit-blog/:blog_id", renderEditBlog);
app.post("/edit-blog/:blog_id", upload.single("image"), editBlog);
app.get("/delete-blog/:blog_id", deleteBlog);
app.get("/logout", logout);

function logout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      req.flash("error", "Terjadi kesalahan. Silakan coba lagi.");
      return res.redirect("/");
    }
    res.redirect("/login");
  });
}
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
    console.log("User logged in:", user);
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

  if (req.file) {
    console.log("File diunggah:", req.file);
    blog.image = req.file.path; // Update image path if new file is uploaded
  } else {
    console.log("Tidak ada file yang diunggah");
  }
  await blog.save();

  res.redirect("/");
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
}

// Di dalam fungsi addBlog
async function addBlog(req, res) {
  try {
    const { title, content, startDate, endDate, nodeJs, reactJs, php, java } = req.body;

    // Validasi tanggal
    if (!isDate(parseISO(startDate)) || !isDate(parseISO(endDate))) {
      req.flash("error", "Tanggal tidak valid!");
      return res.redirect("/blog");
    }

    // Menghitung durasi deskriptif
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    const duration = formatDistance(start, end, { addSuffix: false });

    const imagePath = req.file?.path; // Pastikan file diupload
    if (!imagePath) {
      req.flash("error", "Gambar tidak diunggah.");
      return res.redirect("/blog");
    }

    const userId = req.session.user?.id;
    if (!userId) {
      req.flash("error", "Anda harus login terlebih dahulu.");
      return res.redirect("/login");
    }

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
      image: imagePath,
      userId: userId,
      duration: duration,
    });

    res.redirect("/");
  } catch (error) {
    console.error("Error saat menambahkan blog:", error);
    req.flash("error", "Terjadi kesalahan saat menambahkan blog.");
    res.redirect("/blog");
  }
}

// Lakukan hal yang sama di fungsi editBlog
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

  // Menghitung durasi deskriptif
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  const duration = formatDistance(start, end, { addSuffix: false });
  blog.duration = duration; // Update durasi

  if (req.file) {
    console.log("File diunggah:", req.file);
    blog.image = req.file.path;
  }

  await blog.save();

  res.redirect("/");
}
async function index(req, res) {
  const query = `SELECT public.blogs.*, public."Users".name FROM public.blogs INNER JOIN public."Users"
  ON public.blogs."userId" = public."Users".id;`;
  const result = await sequelize.query(query, { type: QueryTypes.SELECT });

  const user = req.session.user;
  console.log("User from session:", user);
  res.render("index", { data: result, user });
}
function blog(req, res) {
  const user = req.session.user;
  if (!user) {
    return res.redirect("/login");
  }
  res.render("blog");
}
function testimonial(req, res) {
  res.render("testimonial");
}
function contact(req, res) {
  res.render("contact");
}

async function Detail(req, res) {
  const { blog_id } = req.params;
  const result = await blogModel.findOne({
    where: {
      id: blog_id,
    },
    include: [{ model: userModel, attributes: ["name"] }], // Menyertakan nama pengguna
  });

  if (!result) return res.render("not-found");

  res.render("detail", { data: result, user: req.session.user });
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
