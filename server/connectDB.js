const mongoose = require("mongoose");
require("dotenv").config();

const MONGO_URI =
  "mongodb+srv://adventureConnect:N125JBQeS7ANQty9@ac-project.bszws3q.mongodb.net/AdventureConnect?retryWrites=true&w=majority"; //replace with new URI

console.log(MONGO_URI);

// call this function inside server.js
const connectDB = () => {
  mongoose
    .connect(MONGO_URI, {
      // options for the connect method to parse the URI
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // sets the name of the DB that our collections are part of
      dbName: "AdventureConnect", //change to correct DB
    })
    .then(() => console.log("Connected to Mongo DB."))
    .catch((err) => console.log(err));
};

module.exports = connectDB;
