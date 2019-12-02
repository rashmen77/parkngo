let express = require("express");
let app = express();
let reloadMagic = require("./reload-magic.js");
let multer = require("multer");
let MongoClient = require("mongodb").MongoClient;
let upload = multer({ dest: __dirname + "/uploads/" });
let ObjectID = require("mongodb").ObjectID;
let cookieParser = require("cookie-parser");
app.use(cookieParser());
let drivewayImages = multer({
  dest: __dirname + "/uploads/images/drivewayImages/"
});
let profileImageUpload = multer({
  dest: __dirname + "/uploads/images/profileImages/"
});
let sessions = [];
let dbo = undefined;
let url =
  "mongodb+srv://bob:bobsue@cluster0-oit7u.mongodb.net/test?retryWrites=true&w=majority";
MongoClient.connect(url, { useNewUrlParser: true }, (err, db) => {
  dbo = db.db("driveways");
});

let generateId = () => {
  return "" + Math.floor(Math.random() * 100000000);
};

reloadMagic(app);

app.use("/", express.static("build")); // Needed for the HTML and JS files
app.use("/", express.static("public")); // Needed for local assets

// endpoints
app.post("/login", upload.none(), (req, res) => {
  console.log("login", req.body);
  let name = req.body.username;
  let pwd = req.body.password;
  dbo.collection("users").findOne({ username: name }, (err, user) => {
    if (err) {
      console.log("/login error", err);
      res.send(JSON.stringify({ success: false }));
      return;
    }
    if (user === null) {
      res.send(JSON.stringify({ success: false }));
    }
    if (user.password === pwd) {
      let sessionId = generateId();
      sessions[sessionId] = name;
      res.cookie("sid", sessionId);
      res.send(JSON.stringify({ success: true }));

      return;
    }
    res.send(JSON.stringify({ success: false }));
  });
});
app.post("/signup", upload.none(), (req, res) => {
  let name = req.body.username;
  let pwd = req.body.password;
  dbo.collection("users").findOne({ username: name }, (err, user) => {
    if (err) {
      console.log("/login error", err);
      res.send(JSON.stringify({ success: false }));
      return;
    }
    if (user !== null) {
      res.send(JSON.stringify({ success: false }));
    }
    if (user === null) {
      let sessionId = generateId();
      sessions[sessionId] = name;
      res.cookie("sid", sessionId);
      dbo.collection("users").insertOne({
        username: name,
        password: pwd
      });

      res.send(JSON.stringify({ success: true }));

      return;
    }
  });
});

app.all("/*", (req, res, next) => {
  // needed for react router
  res.sendFile(__dirname + "/build/index.html");
});

app.listen(4000, "0.0.0.0", () => {
  console.log("Server running on port 4000");
});
