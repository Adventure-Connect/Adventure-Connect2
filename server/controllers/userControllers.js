const Users = require("../models/userModel");
const Images = require('../models/imageModel');
require("dotenv").config();

const { Storage } = require("@google-cloud/storage");
const { format } = require("util");
const multer = require('multer');
const nodemailer = require('nodemailer');

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
  projectId: 'adventure-connect-2',
});
const bucketName = "adventure-connect-2";
const bucket = cloudStorage.bucket(bucketName);

const userController = {};

//put all the necessary user shit in here as middleware, then put them into routes in api.js, then put that all together in server.js

//verifying user upon logging in, to be put in route for post to /api/login. if route is successful, redirect to show user page

userController.verifyLogin = async (req, res, next) => {
  const { username, password } = req.body

  try {
    //find a user that has a matching username and password
    const user = await Users.findOne({ username, password });

    if (user) {
      console.log('successful log in');
      //maybe just make a cookie for activities and zipcode? so don't have to query the database again later when finding similar users?
      res.cookie('currentUsername', user.username, { httpOnly: false, overwrite: true });
      res.cookie('currentInterests', JSON.stringify(user.interests), { httpOnly: false, overwrite: true });
      res.cookie('zipCode', JSON.stringify(user.zip_code), { httpOnly: false, overwrite: true});
      res.status(200).json({ message: 'Login successful!' });
      res.locals.loginStatus = true;
    } else {
      // If the user is not found, send an error response
      res.status(401).json({ message: 'Invalid credentials!' });
    }
  } catch (error) {
    // If an error occurs, send an error response
    res.status(500).json({ message: 'Server error!' });
  }
  return next();
  }

  // userController.test = (req, res, next) => {
  //   res.send('test')
  // }

  // fetch(endpoint, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     properties
  //   })
  // })
  // .then(response => response.json())
  // .then(data => console.log(data))
  // .catch(error => console.log(error))

  userController.createNewUser = async (req, res, next) => {
    console.log(Users);
    //set all the values for no user from req.body
    // console.log(JSON.stringify(req.body));
    // const {username, firstName, lastName, email, interests, zipCode, password} = req.body
    console.log('before inserting new document to db');
   
    const newUser = new Users({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      zipCode: req.body.zipCode,
      interests: req.body.interests,
      bio: req.body.bio,
    });
    console.log('made the document')
    try {
      //save the new user to the database
      const savedUser = await Users.create(newUser)
      res.cookie('currentEmail', savedUser.email, { httpOnly: false, overwrite: true });
      res.cookie('currentInterests', JSON.stringify(savedUser.interests), { httpOnly: false, overwrite: true });
      res.cookie('zipCode', JSON.stringify(savedUser.zipCode), { httpOnly: false, overwrite: true});
    console.log(JSON.stringify(savedUser.interests), `\nthis is JSON interests`, `\n`, JSON.stringify(savedUser.zipCode), `\n this is JSON zip code`, savedUser.email, `\n this is email`);
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
  const upload =  multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024, // no larger than 5mb, you can change as needed.
    },
    onError : function(err, next) {
      console.log('error', err);
      next(err);
    }
  }).array('image');

  upload(req, res, function (err) {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: 'Error uploading Files'});
    }
    const email = req.params.userEmail;

    console.log(req.files);
    if (!req.files) {
      res.status(400).send("No file uploaded.");
      return;
    }
    try {
      req.files.forEach(file => {
        const blob = bucket.file(file.originalname);
        const blobStream = blob.createWriteStream();
        blobStream.on("error", (err) => {
          // next(err);
          console.log(err);
        });
        blobStream.on("finish", async () => {
          // The public URL can be used to directly access the file via HTTP.
          const publicUrl = format(`https://storage.googleapis.com/${bucket.name}/${blob.name}`);
          Images.create({email: email, image: publicUrl});
        });
        // urls.push(publicUrl);
        blobStream.end(file.buffer);
      });
      res.status(200).send('Images uploaded');
    }
    catch (err) {
      res.status(500).send('Error uploading images');
    }
  });
}

userController.updateUser = async (req, res, next) => {
  try {
    // grab username from the currentUser cookie
    const username = req.cookies.currentUsername;
    //find document by username and update it with the values from req.body
    const updatedUser = await Users.findOneAndUpdate(
      { username },
      req.body,
      { new: true }
    );

    if (updatedUser) {
      console.log(updatedUser);
      res.status(200);
      // Document found and updated successfully
    } else {
      console.log("User not found");
      // No document with the specified username was found
    }
  } catch (error) {
    console.error(error);

  }
  return next();
};

userController.getProfiles = async (req, res, next) => {
  try {
    //grab zipCode from the cookie and convert to number to match schema
    const zipCode = Number(req.cookies.zipCode);
    //grab interests from the cookie, parse it from JSON format
    const interests = JSON.parse(req.cookies.currentInterests);

   //find users with same zipcode and at least one interest in common
    const users = await Users.find({
      zip_code: zipCode,
      interests: { $in: interests },
    });

    console.log(users);
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
}

userController.checkemail = async (req, res) => {
  const email = req.query.email;
  console.log(email);
  try {
    const user = await Users.find({email: email});
    res.status(200).json({user: user});
  }
  catch (error) {
    console.error(error);
    // An error occurred while querying the database
    res.status(500).json({ message: "Server error!" });
  }
}

userController.sendEmail = async (req, res) => {
  // console.log(process.env.MY_EMAIL, process.env.APP_PASSWORD)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    auth: {
      user: process.env.MY_EMAIL,
      pass: process.env.APP_PASSWORD,
    },
  });

  const { recipient_email, OTP } = req.body;

  const mailOptions = {
    from: 'adventureconnect_ptri11@codesmith.com',
    to: recipient_email,
    subject: 'AdventureConnect Password Reset',
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
      res.status(500).send({ message: "An error occurred while sending the email" });
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).send({ message: "Email sent successfully" });
    }
  });
}

userController.updatePassword = async (req, res) =>{
  const { email, newPassword } = req.body;
  try {
    const updatedUser = await Users.findOneAndUpdate({email: email}, { password: newPassword });
    res.status(200).json({updateUser: updatedUser});
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error!" });
  }
}


module.exports = userController;
