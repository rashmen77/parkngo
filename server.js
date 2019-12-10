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

let dbo = undefined;
let url =
  "mongodb+srv://bob:bobsue@cluster0-oit7u.mongodb.net/test?retryWrites=true&w=majority";
MongoClient.connect(
  url,
  { useUnifiedTopology: true, useNewUrlParser: true },
  (err, db) => {
    dbo = db.db("driveways");
  }
);

let generateId = () => {
  return "" + Math.floor(Math.random() * 100000000);
};

reloadMagic(app);

app.use("/", express.static("build")); // Needed for the HTML and JS files
app.use("/", express.static("public")); // Needed for local assets

// endpoints

app.get("/logout", upload.none(), (req, res) => {
  let _sid = req.cookies.sid;
  dbo.collection("users").findOne({ sid: _sid }, (err, user) => {
    if (err) {
      console.log("/login error", err);
      res.send(JSON.stringify({ success: false }));
      return;
    }
    if (user === null || user.sid === "") {
      res.send(JSON.stringify({ success: false }));

      return;
    }
    if (user.sid === _sid) {
      dbo.collection("users").updateOne(
        { sid: _sid },
        {
          $set: {
            sid: ""
          }
        }
      );

      res.send(JSON.stringify({ success: true }));
      return;
    }
  });
});

app.get("/checkLogined", upload.none(), (req, res) => {
  let _sid = req.cookies.sid;
  dbo.collection("users").findOne({ sid: _sid }, (err, user) => {
    if (err) {
      console.log("/login error", err);
      res.send(JSON.stringify({ success: false }));
      return;
    }
    if (user === null || user.sid === "") {
      res.send(JSON.stringify({ success: false }));
      return;
    }

    if (user.sid === _sid) {
      res.send(JSON.stringify({ success: true, data: user }));
      return;
    }
  });
});

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

      dbo.collection("users").updateOne(
        { sid: user.sid },
        {
          $set: {
            sid: sessionId
          }
        }
      );
      res.cookie("sid", sessionId);
      res.send(JSON.stringify({ success: true }));

      return;
    }
    res.send(JSON.stringify({ success: false }));
  });
});
app.post("/signup", upload.none(), (req, res) => {
  let _firstName = req.body.firstName;
  let _lastName = req.body.lastName;
  let _name = req.body.username;
  let _pwd = req.body.password;
  //TODO: validation
  dbo.collection("users").findOne({ username: _name }, (err, user) => {
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

      res.cookie("sid", sessionId);
      dbo.collection("users").insertOne({
        firstName: _firstName,
        lastName: _lastName,
        username: _name,
        sid: sessionId,
        password: _pwd
      });

      res.send(JSON.stringify({ success: true }));

      return;
    }
  });
});

app.post("/postDriveway", drivewayImages.single("file"), (req, res) => {
  let _file = req.file;
  let _filePath = "/uploads/images/drivewayImages/" + _file.filename;

  let _address = req.body.address;
  let _lat = req.body.lat;
  let _lng = req.body.lng;
  let _startDay = req.body.startDay;
  let _startTime = req.body.startTime;
  let _endDay = req.body.endDay;
  let _endTime = req.body.endTime;
  let _price = req.body.price;

  let _user = undefined;

  let _sid = req.cookies.sid;

  dbo.collection("users").findOne({ sid: _sid }, (err, user) => {
    if (err) {
      console.log("/login error", err);
      res.send(JSON.stringify({ success: false }));
      return;
    }
    if (user === null || user.sid === "") {
      res.send(JSON.stringify({ success: false }));
      console.log("/login error 2");
      return;
    }
    if (user.sid === _sid) {
      console.log("/login error 3");
      dbo.collection("posts").insertOne({
        userId: user._id,
        fileURL: _filePath,
        address: _address,
        lat: _lat,
        lng: _lng,
        startDay: _startDay,
        startTime: _startTime,
        endDay: _endDay,
        endTime: _endTime,
        price: _price
      });

      console.log("/login error 4");
      res.send(JSON.stringify({ success: true }));
      return;
    }
  });
});

app.get("/allPosts", upload.none(), (req, res) => {
  dbo
    .collection("posts")
    .find({})
    .toArray((err, posts) => {
      console.log("POSTS", posts);
      if (err) {
        res.send(
          JSON.stringify({
            success: false,
            message: "unable to fetch Art items"
          })
        );
      }

      res.send(
        JSON.stringify({
          success: true,
          data: posts
        })
      );
    });
});

app.all("/*", (req, res, next) => {
  // needed for react router
  res.sendFile(__dirname + "/build/index.html");
});

app.listen(4000, "0.0.0.0", () => {
  console.log("Server running on port 4000");
});
