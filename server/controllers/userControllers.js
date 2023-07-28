const Users = require("../models/userModel");
const Images = require("../models/imageModel");
require("dotenv").config();

const { Storage } = require("@google-cloud/storage");
const { format } = require("util");
const multer = require("multer");
const nodemailer = require("nodemailer");
const { findOneAndUpdate } = require("../models/userModel");

// const upload =  multer({
//   storage: multer.memoryStorage(),
//   limits: {
//     fileSize: 5 * 1024 * 1024, // no larger than 5mb, you can change as needed.
//   },
//   onError : function(err, next) {
//     console.log('error', err);
//     next(err);
//   }
// });

const cloudStorage = new Storage({
  keyFilename: `${__dirname}/../adventure-connect-2-6b84f5eb5738.json`,
  projectId: "adventure-connect-2",
});
const bucketName = "adventure-connect-2";
const bucket = cloudStorage.bucket(bucketName);

const userController = {};

//verifying user upon logging in, to be put in route for post to /api/login. if route is successful, redirect to show user page

userController.verifyLogin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    //find a user that has a matching email and password
    const user = await Users.findOne({ email, password });

    const cookieHeaders = {
      httpOnly: false,
      overwrite: true,
    };

    if (user) {
      console.log("successful log in");

      res.cookie("currentUsername", user.username, {
        httpOnly: false,
        overwrite: true,
      }); // this is currently undefined, the field is under name
      res.cookie("currentEmail", user.email, {
        httpOnly: false,
        overwrite: true,
      });
      res.cookie("currentInterests", JSON.stringify(user.interests), {
        httpOnly: false,
        overwrite: true,
      });
      res.cookie("zipCode", JSON.stringify(user.zipCode), {
        httpOnly: false,
        overwrite: true,
      });
      res.cookie("imageCount", JSON.stringify(user.imageCount), {
        httpOnly: false,
        overwrite: true,
      });
      res.status(200).json({ message: "Login successful!" });

      res.locals.loginStatus = true;
      return next();
    } else {
      // If the user is not found, send an error response
      res.status(401).json({ message: "Invalid credentials!" });
    }
  } catch (error) {
    // If an error occurs, send an error response
    res.status(500).json({ message: "Server error!" });
  }
};

  //create new user from signup, if successful route to dashboard
  
  userController.createNewUser = async (req, res, next) => {
    // console.log(Users);
    //set all the values for no user from req.body
    // console.log(JSON.stringify(req.body));
    // const {username, firstName, lastName, email, interests, zipCode, password} = req.body
    // console.log('before inserting new document to db');
   
    const newUser = new Users({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      zipCode: req.body.zipCode,
      interests: req.body.interests,
      bio: req.body.bio,
      imageCount: req.body.imageCount,
      profilePhoto: "",
    });
    console.log('made the document')
    try {
      //save the new user to the database
      const savedUser = await Users.create(newUser)
      res.cookie('currentEmail', savedUser.email, { httpOnly: false, overwrite: true });
      res.cookie('currentInterests', JSON.stringify(savedUser.interests), { httpOnly: false, overwrite: true });
      res.cookie('zipCode', JSON.stringify(savedUser.zipCode), { httpOnly: false, overwrite: true});
      res.cookie('imageCount', JSON.stringify(user.imageCount), { httpOnly: false, overwrite: true});
    // console.log(JSON.stringify(savedUser.interests), `\nthis is JSON interests`, `\n`, JSON.stringify(savedUser.zipCode), `\n this is JSON zip code`, savedUser.email, `\n this is email`);
    console.log('saved the user to the db');
    return next()
  } catch (error) {
    console.log(error);
    next(error)
  }
  
  // .then((data) => {
  //   Users.insertOne({data})
  //   console.log('User saved to the database');
  //   return next();
  // })
  // .catch(error => {
  //   console.log('Error saving user:', error);
  //   return next({error: error.message})
  // });
  }

  userController.uploadImages = (req, res) => {
    const upload = multer({
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 10 * 1024 * 1024, // no larger than 10mb, you can change as needed.
      },
      onError: function (err, next) {
        console.log("error", err);
        next(err);
      },
    }).array("image");
  
    const processFile = (file, email, bucket) => {
      return new Promise((resolve, reject) => {
        const blob = bucket.file(file.originalname);
        const blobStream = blob.createWriteStream();
  
        blobStream.on("error", (err) => {
          console.log(err);
          reject(err);
        });
  
        blobStream.on("finish", async () => {
          const publicUrl = format(
            `https://storage.googleapis.com/${bucket.name}/${blob.name}`
          );
  
          try {
            await Images.create({ email: email, image: publicUrl });
            res.locals.returnUrls.push(publicUrl); // push publicUrl into res.locals.returnUrls
            console.log('publicUrl: ', publicUrl);
            console.log('return Urls: ', res.locals.returnUrls);
  
            if (res.locals.returnUrls.length === 1) { // Check if the first image is uploaded
              const updatedUser = await Users.findOneAndUpdate(
                { email: email, profilePhoto: "" },
                { $set: { profilePhoto: publicUrl } },
                { new: true }
              );
              if (updatedUser) {
                console.log("profile photo updated for new User");
              } else {
                console.log("user already exists, profile photo not updated");
              }
              res.locals.profilePhoto = publicUrl;
            }
  
            resolve();
          } catch (error) {
            reject(error);
          }
        });
  
        blobStream.end(file.buffer);
      });
    };
  
    upload(req, res, async function (err) {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Error uploading Files" });
      }
      const email = req.params.userEmail;
  
      // console.log(req.files);
      if (!req.files) {
        res.status(400).send("No file uploaded.");
        return;
      }
  
      res.locals.returnUrls = [];
      try {
        await Promise.all(req.files.map((file) => processFile(file, email, bucket)));
  
        console.log('outside blobStream urls: ', res.locals.returnUrls);
        res.status(200).json({ message: 'Images upload', returnUrls: res.locals.returnUrls });
      } catch (error) {
        console.error('Error uploading images:', error);
        res.status(500).json({ message: 'Error uploading images' });
      }
    });
  };

//middleware to delete images from the Images collection. Google storage is unaffected
userController.deleteImage = async (req, res, next) => {
  const email = req.params.userEmail;
  const imageUrl = req.body.image;

  const deletedImages = [];
  try {
    for (let i = 0; i < imageUrl.length; i++) {
      // find image with matching url and email and delete it
      let deleted = await Images.deleteOne({ email: email, image: imageUrl }); //delete image from Image collection
      if (deleted) deletedImages.push(deleted); //push deleted image to deletedImages array
      else console.log('image not found: ', index); //if image not found, log index of image
      
    }
  }
    catch (err) {
    res.status(500).send("Error deleting images");
    res.end();
    console.log(err);
  }
  res.status(200).send("Images deleted");
};

userController.updateUser = async (req, res, next) => {
  try {
    // grab username from the currentUser cookie
    const username = req.cookies.currentUsername;
    const email = req.cookies.currentEmail;
    //find document by username and update it with the values from req.body

    const updatedUser = await Users.findOneAndUpdate(
      { email }, //this used to be username, changed to email
      req.body,
      { new: true }
    );

    if (updatedUser) {
      // console.log(updatedUser);
      res.cookie("currentUsername", updatedUser.username, {
        httpOnly: false,
        overwrite: true,
      }); // this is currently undefined, the field is under name
      res.cookie("currentEmail", updatedUser.email, {
        httpOnly: false,
        overwrite: true,
      });
      res.cookie("currentInterests", JSON.stringify(updatedUser.interests), {
        httpOnly: false,
        overwrite: true,
      });
      res.cookie("zipCode", JSON.stringify(updatedUser.zip_code), {
        httpOnly: false,
        overwrite: true,
      });
      res.cookie("imageCount", JSON.stringify(updatedUser.imageCount), {
        httpOnly: false,
        overwrite: true,
      });
      res.status(200);
      // Document found and updated successfully
    } else {
      console.log("User not found");
      // No document with the specified email was found
    }
  } catch (error) {
    console.error(error);
  }
  return next();
};

//this middleware is for when people are updating their information on the Edit Profile page
userController.updateUserInfo = async (req, res, next) => {
  try {
    console.log("updateUserInfo firing");

    const { name, location, bio, email } = req.body;
    const updatedUser = await Users.findOneAndUpdate(
      { email: email },
      { $set: { name: name, zipCode: location, bio: bio } }
    );
    if (updatedUser === null) {
      res
        .status(500)
        .json({ message: "Hmmm...we did not find you in our databas" });
    } else {
      res.status(200).json({ message: "Your profile has been updated!" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message:
        "We're experiencing technical difficulties. Please try again later.",
    });
  }
  return next();
};

//this middleware is for when people are updating their information on the Edit Profile page
userController.getInterests = async (req, res, next) => {
  const email = req.query.email;
  try {
    console.log("getInterests firing");
    const userInterests = await Users.findOne({ email: email });
    console.log(email);
    res.status(200).json(userInterests.interests);
  } catch (error) {
    console.error(error);
  }
  return next();
};

userController.getProfiles = async (req, res, next) => {
  const zipCode = req.query.zipCode;
  console.log("THIS IS THE ZIPCODE", zipCode);
  const interests = req.query.currentInterests.split(",");

  try {
    //grab zipCode from the cookie and convert to number to match schema
    // const zipCode = Number(req.cookies.zipCode);
    // const zipCode = 10001;
    //grab interests from the cookie, parse it from JSON format
    // const interests = JSON.parse(req.cookies.currentInterests);
    // const interests = ["Climbing", "Hiking"];
    // const interests = ["IDK"];

    //find users with same zipcode and at least one interest in common
    //find users with same zipcode and at least one interest in common
    const users = await Users.find({
      zipCode: zipCode,
      interests: { $in: interests },
    });

    // interests: { $in: interests },

    // console.log("this is the users", users);
    // Array of users with matching zipCode and at least one common interest

    res.status(200);
    //store users on res.locals
    res.locals.matchingUsers = users;
  } catch (error) {
    console.error(error);
    // An error occurred while querying the database
    res.status(500).json({ message: "Server error!" });
  }
  return next();
};

userController.checkemail = async (req, res) => {
  const email = req.query.email;
  console.log(email);
  try {
    const user = await Users.find({ email: email });
    res.status(200).json({ user: user });
  } catch (error) {
    console.error(error);
    // An error occurred while querying the database
    res.status(500).json({ message: "Server error!" });
  }
};

userController.sendEmail = async (req, res) => {
  // console.log(process.env.MY_EMAIL, process.env.APP_PASSWORD)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    auth: {
      user: process.env.MY_EMAIL,
      pass: process.env.APP_PASSWORD,
    },
  });

  const { recipient_email, OTP } = req.body;

  const mailOptions = {
    from: "adventureconnect_ptri11@codesmith.com",
    to: recipient_email,
    subject: "AdventureConnect Password Reset",
    html: `<html>
             <body>
               <h2>Password Recovery</h2>
               <p>Use this OTP to reset your password. OTP is valid for 1 minute</p>
               <h3>${OTP}</h3>
             </body>
           </html>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res
        .status(500)
        .send({ message: "An error occurred while sending the email" });
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).send({ message: "Email sent successfully" });
    }
  });
};

userController.updatePassword = async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    const updatedUser = await Users.findOneAndUpdate(
      { email: email },
      { password: newPassword }
    );
    res.status(200).json({ updateUser: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error!" });
  }
};

userController.sendFriendRequest = async (req, res) => {
  const { name, email, currentUserEmail } = req.body;
  console.log("this is the cookie", req.cookies);
  const currentUser = await Users.findOne({ email: currentUserEmail });
  const user = await Users.findOne({ name, email });

  await Users.findOneAndUpdate(
    { name, email },
    {
      friendRequests: [
        ...user.friendRequests,
        {
          user_id: currentUser._id,
          name: currentUser.name,
          profilePhoto: currentUser.profilePhoto,
        },
      ],
    }
  );
  res.sendStatus(200);
};

userController.getFriendRequest = async (req, res) => {
  const email = req.params.email;
  console.log("IDK WHY", email);
  const user = await Users.findOne({ email });
  console.log("this is the user");
  // console.log("friend request", user.friendRequests);
  res.status(200).json({ data: user.friendRequests });
};

userController.connections = async (req, res) => {
  const { name, currentUser } = req.body;
  const currUser = await Users.findOne({ email: currentUser });
  const reqUser = await Users.findOne({ name });
  const currUserConnections = currUser.connections;
  const reqUserConnections = reqUser.connections;
  const newFriendRequest = currUser.friendRequests.filter(
    (elem) => elem.name !== reqUser.name
  );

  const retDoc = await Users.findOneAndUpdate(
    { email: currentUser },
    {
      connections: [
        ...currUserConnections,
        {
          user_id: reqUser._id,
          name: reqUser.name,
          profilePhoto: reqUser.profilePhoto,
        },
      ],
      friendRequests: newFriendRequest,
    },
    { new: true }
  );

  await Users.findOneAndUpdate(
    { name },
    {
      connections: [
        ...reqUserConnections,
        {
          user_id: currUser._id,
          name: currUser.name,
          profilePhoto: currUser.profilePhoto,
        },
      ],
    }
  );

  console.log("Successful");
  console.log(retDoc);
  res.status(200).json({ data: retDoc.friendRequests });
};

module.exports = userController;
