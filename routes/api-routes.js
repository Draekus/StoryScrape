const db = require ("../models/index.js");
const axios = require("axios");
const cheerio = require("cheerio");

module.exports = function(app) {
  // Routes
  // 1. At the root path, send a simple hello world message to the browser
  app.get("/", function(req, res) {
    res.send("Hello world");
  });

  app.post("/article-submit", (req, res) => {
    // Create a new article using req.body
    db.Article.create(req.body)
      .then(function(dbArticle) {
        // If saved successfully, send the the new Article document to the client
        console.log("An article was added to the database.");
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurs, send the error to the client
        res.json(err);
      });
  });

  app.post("/comment-submit", (req, res) => {
    // Create a new article using req.body
    db.Comment.create(req.body)
      .then(function(dbComment) {
        // If saved successfully, send the the new Article document to the client
        console.log("A comment was added to the database.");
        res.json(dbComment);
      })
      .catch(function(err) {
        // If an error occurs, send the error to the client
        res.json(err);
      });
  });
};
