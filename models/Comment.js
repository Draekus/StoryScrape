// Require mongoose
const mongoose = require("mongoose");

// Reference to the mongoose Schema constructor
const Schema = mongoose.Schema;

// Schema Object
const CommentSchema = new Schema({
  text: {
    type: String,
    trim: true,
  },
  author: {
    type: String,
    trim: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// This creates the Article model with the above schema
const Comment = mongoose.model("Comment", CommentSchema);

// Export the Article model
module.exports = Comment;
