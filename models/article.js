// Require mongoose
const mongoose = require("mongoose");

// Reference to the mongoose Schema constructor
const Schema = mongoose.Schema;

// Schema Object
const ArticleSchema = new Schema({
  title: {
    type: String,
  },
  summary: {
    type: String,
  },
  url: {
    type: String,
  },
  image: {
    type: String,
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  saved: {
    type: Boolean,
    default: false,
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
