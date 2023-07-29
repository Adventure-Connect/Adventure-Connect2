const express = require("express");
const router = express.Router();
const userController = require("../controllers/userControllers");
const Images = require("../models/imageModel");

router.get("/check_email", userController.checkemail, async (req, res) => {
  // console.log(req.query.email);
  res.end();
});

router.post("/send_email", userController.sendEmail, async (req, res) => {
  res.end();
});

router.put(
  "/update-password",
  userController.updatePassword,
  async (req, res) => {
    res.end();
  }
);

router.get("/getImages/:email", async (req, res) => {
  // const email = req.params.userEmail;
  const email = req.params.email;
  console.log("this is the email", email);
  try {
    const image = await Images.find({ email: email });
    // console.log('image',image[0].image);
    res.status(200).json(image);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.post(
  "/upload-file-to-cloud-storage/:userEmail",
  userController.uploadImages,
  function (req, res, next) {
    res.end();
  }
);

router.delete(  "/deleteImage/:userEmail",
(req, res, next) => {
  console.log("enter delete route");
  return next();
},
  userController.deleteImage
)

router.get("/", (req, res) => {
  res.send("hello world");
});

//login router, verify user then redirect to user profiles page
//fine that im setting status and sending message in the controller instead of last step?
router.post("/login", userController.verifyLogin, (req, res) => {
  //end the response, with status and message set in verifyUser middleware
  res.end();
  //front code on login component should determine whether to redirect to userProfiles based on error or not
});

//signup route:
router.post("/signup", userController.createNewUser, (req, res) => {
  res.end();
});

//update profile/settings route:

router.put(
  "/api/user",
  (req, res, next) => {
    console.log("enter api/api/user");
    return next();
  },
  userController.updateUser,
  (req, res) => {
    res.end();
  }
);

//route to grab similar users to populate UserProfiles, based on zipcode and interest
router.get("/api/getUsers", userController.getProfiles, (req, res) => {
  const usersToDisplay = res.locals.matchingUsers;
  res.json(usersToDisplay);
});



router.post(
  "/friendRequest",
  userController.sendFriendRequest,
  (req, res) => {}
);

router.get(
  "/friendRequest/:email",
  userController.getFriendRequest,
  (req, res) => {}
);

router.post("/accept", userController.connections, (req, res) => {});

router.put("/account", userController.updateUserInfo, (req, res) => {
  res.end();
});

router.get("/interests", userController.getInterests, (req, res) => {
  console.log("/interests firing");
  res.end();
});

//GET a user --> created by KS 7/26
router.get("/:email", userController.getCurrentUser, (req, res) => {
  res.status(200).json(res.locals.userFound);
});

module.exports = router;
