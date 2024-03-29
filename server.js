require("dotenv").config();

let express = require("express");
let app = express();
let reloadMagic = require("./reload-magic.js");
let multer = require("multer");
let MongoClient = require("mongodb").MongoClient;
let upload = multer({ dest: __dirname + "/uploads/" });
let ObjectID = require("mongodb").ObjectID;
let cookieParser = require("cookie-parser");
app.use("/uploads", express.static("uploads"));

let authData = require("./AuthData");

app.use(cookieParser());

let drivewayImages = multer({
  dest: __dirname + "/uploads/images/drivewayImages/"
});
let profileImageUpload = multer({
  dest: __dirname + "/uploads/images/profileImages/"
});

MongoClient.connect(
  authData.MongoDB_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  (err, db) => {
    if (err) {
      console.log("MongoClient connect error - ", err);
    }
    let dbo = db.db("parkngo");

    start_server(dbo);
  }
);

//Used to generate SID
let generateId = () => {
  return "" + Math.floor(Math.random() * 100000000);
};

reloadMagic(app);

let start_server = dbo => {
  app.use("/", express.static("build")); // Needed for the HTML and JS files
  app.use("/", express.static("public")); // Needed for local assets

  // endpoints

  /**
   * Erases cookie on broswer side, breaking the link.
   */
  app.get("/logout", upload.none(), (req, res) => {
    let _sid = req.cookies.sid;

    dbo.collection("users").findOne({ sid: _sid }, (err, user) => {
      console.log("logout", user);
      if (err) {
        res.send(JSON.stringify({ success: false }));
        return;
      }
      if (user === null || user.sid === "") {
        res.send(JSON.stringify({ success: false }));

        return;
      }
      if (user.sid === _sid) {
        res.clearCookie("sid");

        res.send(JSON.stringify({ success: true }));
        return;
      }
    });
  });

  /**
   * checking if the browser cookie is associated with a user, if yes user is loaded
   */
  app.get("/checkLogined", upload.none(), (req, res) => {
    let _sid = req.cookies.sid;
    dbo.collection("users").findOne({ sid: _sid }, (err, user) => {
      console.log("checkLogine", user);
      if (err) {
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

  /**
   * Once user logs in, new SID is generate and stored in USER's Document
   */
  app.post("/login", upload.none(), (req, res) => {
    let name = req.body.username;
    let pwd = req.body.password;

    dbo.collection("users").findOne({ username: name }, (err, user) => {
      console.log("login user", user);
      if (err) {
        res.send(JSON.stringify({ success: false }));
        return;
      }
      if (user === null) {
        res.send(JSON.stringify({ success: false }));
        return;
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
        res.send(JSON.stringify({ success: true, data: user }));

        return;
      }
      res.send(JSON.stringify({ success: false }));
    });
  });

  /**
   * checks if user alread exists > creates new user Document and stores SID. Sends back cookie with SID
   * link is created between SID in user Document and broswer cookie
   */
  app.post("/signup", upload.none(), (req, res) => {
    let _firstName = req.body.firstName;
    let _lastName = req.body.lastName;
    let _name = req.body.username;
    let _pwd = req.body.password;

    //TODO: validation front end

    dbo.collection("users").findOne({ username: _name }, (err, user) => {
      if (err) {
        res.send(JSON.stringify({ success: false }));
        return;
      }
      if (user !== null) {
        res.send(JSON.stringify({ success: false }));
      }
      if (user === null) {
        let sessionId = generateId();

        dbo.collection("users").insertOne(
          {
            firstName: _firstName,
            lastName: _lastName,
            username: _name,
            sid: sessionId,
            password: _pwd,
            file: ""
          },
          (err, response) => {
            res.cookie("sid", sessionId);
            res.send(JSON.stringify({ success: true, data: response.ops[0] }));

            return;
          }
        );
      }
    });
  });

  /**
   * Post parking lot
   */
  app.post("/postProperty", drivewayImages.single("file"), (req, res) => {
    let _file = req.file;
    let _filePath = "/uploads/images/drivewayImages/image_placeHolder.png";
    if (_file !== undefined) {
      _filePath = "/uploads/images/drivewayImages/" + _file.filename;
    }

    let _dailyPrice = req.body.dailyPrice;
    let _monthly = req.body.monthly;
    let _monthlyPrice = req.body.monthlyPrice;
    let _addressID = req.body.address_id;
    let _address = req.body.address;
    let _lat = req.body.lat;
    let _lng = req.body.lng;
    let _availableStart = req.body.availableStart;
    let _availableEnd = req.body.availableEnd;
    let _price = req.body.price;
    let _description = req.body.description;
    let _parkingQty = req.body.parkingQty;

    let _sid = req.cookies.sid;

    dbo.collection("users").findOne({ sid: _sid }, (err, user) => {
      if (err) {
        res.send(JSON.stringify({ success: false }));
        return;
      }
      if (user === null || user.sid === "") {
        res.send(JSON.stringify({ success: false }));

        return;
      }
      if (user.sid === _sid) {
        dbo.collection("posts").insertOne({
          userId: user._id,
          fileURL: _filePath,
          addressID: _addressID,
          address: _address,
          lat: _lat,
          lng: _lng,
          availableStart: _availableStart,
          availableEnd: _availableEnd,
          description: _description,
          parkingQty: _parkingQty,
          price: _price,
          monthly: _monthly,
          monthlyPrice: _monthlyPrice,
          dailyPrice: _dailyPrice,
          file: JSON.stringify(_file)
        });

        res.send(JSON.stringify({ success: true }));
        return;
      }
    });
  });

  /**
   * Get all posts
   */
  app.get("/allPosts", upload.none(), (req, res) => {
    let _monthly = req.query.monthly;
    let _query = {};

    if (_monthly != undefined) {
      _query.monthly = _monthly;
    }

    dbo
      .collection("posts")
      .find(_query)
      .toArray((err, posts) => {
        if (err) {
          res.send(
            JSON.stringify({
              success: false,
              message: "unable to fetch items"
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

  /**
   * single post by postID
   */
  app.get("/getPost", upload.none(), (req, res) => {
    let _postID = req.query.id;

    dbo.collection("posts").findOne({ _id: ObjectID(_postID) }, (err, post) => {
      console.log("get post ", post);
      if (err) {
        res.send(
          JSON.stringify({
            success: false,
            message: "unable to fetch post item"
          })
        );
      }

      if (post === undefined) {
        res.send(
          JSON.stringify({
            success: false,
            message: "post undefined"
          })
        );
      }

      if (post !== undefined) {
        res.send(
          JSON.stringify({
            success: true,
            data: post
          })
        );
      }
    });
  });

  /**
   * all posts by the user
   */
  app.get("/getUserPosts", upload.none(), (req, res) => {
    let _sid = req.cookies.sid;

    dbo.collection("users").findOne({ sid: _sid }, (err, user) => {
      console.log("get user post", user);
      if (err) {
        res.send(
          JSON.stringify({
            success: false,
            message: "Error"
          })
        );
        return;
      }

      if (user === undefined) {
        res.send(
          JSON.stringify({
            success: false,
            message: "User not found"
          })
        );
        return;
      }

      if (user !== undefined) {
        dbo
          .collection("posts")
          .find({ userId: ObjectID(user._id) })
          .toArray((err, posts) => {
            if (err) {
              res.send(
                JSON.stringify({
                  success: false,
                  message: "Error"
                })
              );
            }

            if (posts !== undefined) {
              res.send(
                JSON.stringify({
                  success: true,
                  data: posts
                })
              );
            }
          });
      }
    });
  });

  /**
   * delete post
   */
  app.get("/deletePost", upload.none(), (req, res) => {
    let _postID = req.query.id;
    let _sid = req.cookies.sid;

    try {
      dbo.collection("posts").deleteOne({ _id: ObjectID(_postID) });

      dbo.collection("users").findOne({ sid: _sid }, (err, user) => {
        console.log("get delete user post", user);
        if (err) {
          return res.send(
            JSON.stringify({
              success: false,
              message: "Error"
            })
          );
        }

        if (user === undefined) {
          return res.send(
            JSON.stringify({
              success: false,
              message: "User not found"
            })
          );
        }

        if (user !== undefined) {
          dbo
            .collection("posts")
            .find({ userId: ObjectID(user._id) })
            .toArray((err, posts) => {
              if (err) {
                return res.send(
                  JSON.stringify({
                    success: false,
                    message: "Error"
                  })
                );
              }

              if (posts !== undefined) {
                return res.send(
                  JSON.stringify({
                    success: true,
                    data: posts,
                    message: "Post deleted"
                  })
                );
              }
            });
        }
      });
    } catch (e) {
      return res.send(
        JSON.stringify({ success: false, message: e.toString() })
      );
    }
  });

  /**
   * edit post
   */
  app.post("/editPost", drivewayImages.single("file"), (req, res) => {
    let _file = req.file;
    let _filePath = "/uploads/images/drivewayImages/image_placeHolder.png";
    if (_file !== undefined) {
      _filePath = "/uploads/images/drivewayImages/" + _file.filename;
    }

    let _postID = req.body.postID;
    let _userID = ObjectID(req.body.userID);

    let _addressID = req.body.address_id;
    let _address = req.body.address;
    let _lat = req.body.lat;
    let _lng = req.body.lng;
    let _availableStart = req.body.availableStart;
    let _availableEnd = req.body.availableEnd;
    let _price = req.body.price;
    let _description = req.body.description;
    let _parkingQty = req.body.parkingQty;

    let _dailyPrice = req.body.dailyPrice;
    let _monthly = req.body.monthly;
    let _monthlyPrice = req.body.monthlyPrice;

    dbo.collection("posts").updateOne(
      { _id: ObjectID(_postID) },
      {
        $set: {
          userId: _userID,
          fileURL: _filePath,
          addressID: _addressID,
          address: _address,
          lat: _lat,
          lng: _lng,
          availableStart: _availableStart,
          availableEnd: _availableEnd,
          description: _description,
          parkingQty: _parkingQty,
          price: _price,
          monthly: _monthly,
          monthlyPrice: _monthlyPrice,
          dailyPrice: _dailyPrice
        }
      },
      (err, data) => {
        if (err) {
          res.send(
            JSON.stringify({
              success: false,
              message: err
            })
          );
        }
        res.send(
          JSON.stringify({
            success: true,
            message: "post updated"
          })
        );
      }
    );
  });

  /**
   *
   */
  app.post("/editProfile", profileImageUpload.single("file"), (req, res) => {
    let _userID = req.query.userID;

    console.log("edit profile ", req.body);

    let _file = req.file;
    let _filePath = "/uploads/images/profileImages/image_placeHolder.png";
    if (_file !== undefined) {
      _filePath = "/uploads/images/profileImages/" + _file.filename;
    }

    let _firstName = req.body.firstName;
    let _lastName = req.body.lastName;
    let _username = req.body.username;
    let _pwd = req.body.password;

    dbo.collection("users").findOne({ username: _username }, (err, user) => {
      if (err) {
        res.send(JSON.stringify({ success: false, message: "server err" }));
        return;
      }
      if (user !== null && user.username !== _username) {
        res.send(JSON.stringify({ success: false, message: "username taken" }));
      }
      if (user === null || user.username === _username) {
        dbo.collection("users").findOneAndUpdate(
          { _id: ObjectID(_userID) },
          {
            $set: {
              firstName: _firstName,
              lastName: _lastName,
              username: _username,
              password: _pwd,
              file: JSON.stringify(_file),
              fileURL: _filePath
            }
          },
          { returnNewDocument: true },
          function(err, documents) {
            res.send({
              success: true,
              message: "profile updated",
              error: err,
              affected: documents
            });
            return;
          }
        );
      }
    });
  });

  /**
   * When puchases is completed the qty is updated and new Puchase document is created
   */
  app.post("/updateQtyAndToPurchases", upload.none(), (req, res) => {
    let _postID = req.query.postID;
    let _ownerID = req.body.ownerID;
    let _totalamt = req.body.totalamt;
    let _newQty = req.body.newQty;
    let _buyerID = req.body.buyerID;
    let _qrcodeValue = req.body.qrcodeValue;

    dbo.collection("posts").updateOne(
      { _id: ObjectID(_postID) },
      {
        $set: { parkingQty: _newQty }
      },
      (err, data) => {
        if (err) {
          res.send(
            JSON.stringify({
              success: false,
              message: err
            })
          );
        }

        try {
          dbo.collection("purchases").insertOne({
            postID: ObjectID(_postID),
            ownerID: ObjectID(_ownerID),
            purchaseAmt: _totalamt,
            buyerID: ObjectID(_buyerID),
            qrcodeValue: _qrcodeValue
          });
        } catch (error) {
          res.send(
            JSON.stringify({
              success: false,
              message: error
            })
          );
        }

        res.send(
          JSON.stringify({
            success: true,
            message: "post updated"
          })
        );
      }
    );
  });

  /**
   * all purchases by the user
   */
  app.get("/getPurchases", upload.none(), (req, res) => {
    let _sid = req.cookies.sid;

    dbo.collection("users").findOne({ sid: _sid }, (err, user) => {
      console.log("get user posrt", user);
      if (err) {
        res.send(
          JSON.stringify({
            success: false,
            message: "Error"
          })
        );
      }

      if (user === undefined) {
        res.send(
          JSON.stringify({
            success: false,
            message: "User not found"
          })
        );
      }

      if (user !== undefined) {
        dbo
          .collection("purchases")
          .find({ buyerID: ObjectID(user._id) })
          .toArray((err, purchases) => {
            if (err) {
              res.send(
                JSON.stringify({
                  success: false,
                  message: "Error"
                })
              );
            }

            if (purchases !== undefined) {
              res.send(
                JSON.stringify({
                  success: true,
                  data: purchases
                })
              );
            }
          });
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
};
