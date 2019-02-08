// Dependencies
const express = require("express");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");

// Dynamically generate PORT for Heroku & Local Development
const PORT = process.env.PORT || 8080;

// Initialize Express
const app = express();

// Initialize Mongoose
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// Initialize Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Set up a static folder (public) & middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
require("./routes/api-routes")(app);

// Start the server
app.listen(PORT, function() {
  console.log(`Your app is running on port ${PORT} you better catch it!`);
});
