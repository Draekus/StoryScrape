// Require mongoose
const mongoose = require("mongoose");

// Reference to the mongoose Schema constructor
const Schema = mongoose.Schema;

// Schema Object
const ArticleSchema = new Schema({
  title: {
    type: String,
    unique: true,
    required: "A Title is Required",
  },
  summary: {
    type: String,
    unique: true,
    required: "A Sumary is Required",
  },
  url: {
    type: String,
    match: [
      /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm,
      "The URL was invalid.",
    ],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// This creates the Article model with the above schema
const Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;
