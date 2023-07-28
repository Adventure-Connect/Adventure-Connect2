const mongoose = require("mongoose");

// Users
const usersSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  zipCode: { type: Number, required: true },
  interests: { type: Array },
  bio: { type: String },
  imageCount: { type: Number },
  profilePhoto: { type: String },
  friendRequests: { type: Array },
  connections: { type: Array },
});

//CONNECTIONS ARRAY
// [{ user_id: "fffefef", name: "Zai", profilePhoto: "iijijiji" }];

const Users = mongoose.model("Users", usersSchema);

module.exports = Users;
