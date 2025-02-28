const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
app.use("/profilePics", express.static("profilePics"));
app.use(express.static(path.join(__dirname, "./client/build")));
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "profilePics");
  },
  filename: function (req, file, cb) {
    console.log(file);
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

let userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  age: Number,
  email: String,
  password: String,
  mobileNo: String,
  profilePic: String,
});

let User = new mongoose.model("users", userSchema, "users");

let connectToMDB = async () => {
  try {
    mongoose.connect(
      "mongodb+srv://manjunadhb:manjunadhb@batch2410cluster.lpdhk.mongodb.net/batch2410?retryWrites=true&w=majority&appName=Batch2410Cluster"
    );

    console.log("Successfully connected to MDB");
  } catch (err) {
    console.log("Unable to connect to MDB");
  }
};

connectToMDB();

app.get("*", (req, res) => {
  res.sendFile("./client/build/index.html");
});

app.post("/signup", upload.single("profilePic"), async (req, res) => {
  console.log("inside signup");
  console.log(req.body);
  console.log(req.file); //upload.single
  console.log(req.files); //upload.array

  let hashedPassword = await bcrypt.hash(req.body.password, 10);

  try {
    let newSignup = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      age: req.body.age,
      email: req.body.email,
      password: hashedPassword,
      mobileNo: req.body.mobileNo,
      profilePic: req.file.path,
    });

    await newSignup.save();
    console.log("New User Saved Successfully");
    res.json({ status: "success", msg: "User Created Successfully." });
  } catch (err) {
    console.log("Unable to save user");
    res.json({ status: "failure", msg: "Unable to create User." });
  }
});

app.patch("/updateProfile", upload.single("profilePic"), async (req, res) => {
  console.log("received details for update");
  console.log(req.body);

  if (req.body.firstName.trim().length > 0) {
    await User.updateMany(
      { email: req.body.email },
      { firstName: req.body.firstName }
    );
  }

  if (req.body.lastName.trim().length > 0) {
    await User.updateMany(
      { email: req.body.email },
      { lastName: req.body.lastName }
    );
  }

  if (req.body.age > 0) {
    await User.updateMany({ email: req.body.email }, { age: req.body.age });
  }

  if (req.body.password.length > 0) {
    await User.updateMany(
      { email: req.body.email },
      { password: req.body.password }
    );
  }

  if (req.body.mobileNo.trim().length > 0) {
    await User.updateMany(
      { email: req.body.email },
      { mobileNo: req.body.mobileNo }
    );
  }

  if (req.file) {
    await User.updateMany(
      { email: req.body.email },
      { profilePic: req.file.path }
    );
  }

  res.json({ status: "success", msg: "Profile updated successfully." });
});

app.delete("/deleteProfile", async (req, res) => {
  console.log(req.query);

  let response = await User.deleteMany({ email: req.query.email });

  console.log(response);

  if (response.deletedCount > 0) {
    res.json({ status: "success", msg: "User deleted successfully" });
  } else {
    res.json({ status: "failure", msg: "User not deleted" });
  }
});

app.post("/login", upload.none(), async (req, res) => {
  console.log("/inside login");
  let userDataArr = await User.find().and([{ email: req.body.email }]);

  if (userDataArr.length > 0) {
    let isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      userDataArr[0].password
    );

    if (isPasswordCorrect == true) {
      let token = jwt.sign(
        {
          email: req.body.email,
          password: req.body.password,
        },
        "abcd"
      );

      let userDetails = {
        firstName: userDataArr[0].firstName,
        lastName: userDataArr[0].lastName,
        age: userDataArr[0].age,
        email: userDataArr[0].email,
        mobileNo: userDataArr[0].mobileNo,
        profilePic: userDataArr[0].profilePic,
        token: token,
      };

      res.json({ status: "success", data: userDetails });
    } else {
      res.json({ status: "failure", msg: "Invalid Password" });
    }
  } else {
    res.json({ status: "failure", msg: "User doesnot exist." });
  }

  console.log(userDataArr);
});

app.post("/validateToken", upload.none(), async (req, res) => {
  console.log("inside validate token");
  console.log(req.body.token);

  let decryptedToken = jwt.verify(req.body.token, "abcd");
  console.log(decryptedToken);

  let userDataArr = await User.find().and([{ email: decryptedToken.email }]);

  if (userDataArr.length > 0) {
    if (userDataArr[0].password == decryptedToken.password) {
      let userDetails = {
        firstName: userDataArr[0].firstName,
        lastName: userDataArr[0].lastName,
        age: userDataArr[0].age,
        email: userDataArr[0].email,
        mobileNo: userDataArr[0].mobileNo,
        profilePic: userDataArr[0].profilePic,
      };

      res.json({ status: "success", data: userDetails });
    } else {
      res.json({ status: "failure", msg: "Invalid Password" });
    }
  } else {
    res.json({ status: "failure", msg: "User doesnot exist." });
  }
});

app.listen(4567, () => {
  console.log("Listening to port 4567");
});
