const mongoose = require("mongoose");

// Users
const usersSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  zipCode: { type: Number, required: true },
  interests: { type: Array },
  bio: { type: String },
  image1: { type: Buffer },
  image2: { type: Buffer },
  image3: { type: Buffer },
  image4: { type: Buffer },
  image5: { type: Buffer },
  image6: { type: Buffer }
});

const Users = mongoose.model("Users", usersSchema);

module.exports = Users
