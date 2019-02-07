const db = require("../models/index.js");
const axios = require("axios");
const cheerio = require("cheerio");
const request = require("request");

module.exports = function(app) {
  // Main route for index page
  app.get("/", function(req, res) {
    db.Article.find({})
      .populate("comments")
      .then(function(dbArticle) {
        res.render("index", { article: dbArticle });
      })
      .catch(function(err) {
        // If an error occurs, send it back to the client
        res.json(err);
      });
  });

  // Route that scrapes kotaku for articles and adds them to the database
  app.get("/article-search", (req, res) => {
    request("https://kotaku.com/", function(error, response, html) {
      const $ = cheerio.load(html);
      let results = [];

      $(".post-wrapper").each(function(i, element) {
        let url = $(element)
          .find(".js_entry-link")
          .attr("href");
        let title = $(element)
          .find(".headline")
          .text();
        let summary = $(element)
          .find(".entry-summary")
          .text();
        let image = $(element)
          .find("source")
          .data("srcset");
        let result = {
          url: url,
          title: title,
          summary: summary,
          image: image,
        };

        db.Article.create(result)
          .then(dbArticle => {
            res.json(dbArticle);
          })
          .catch(err => {
            res.json(err);
          });
        results.push(result);
        console.log(result.image);
        console.log(result.author);
      });
      if (error) {
        throw error;
      }
      res.redirect("/");
    });
  });

  // Development Routes
  // .........................................

  // Test route for adding articles to database
  app.post("/article-submit", (req, res) => {
    // Create a new article using req.body
    db.Article.create(req.body)
      .then(function(dbArticle) {
        // If saved successfully, send the the new Article document to the client
        console.log(
          `An article was added to the database.\n @ ${dbArticle.date}`
        );
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurs, send the error to the client
        res.json(err);
      });
  });

  // Test route for adding comments to database
  app.post("/comment-submit", (req, res) => {
    // Create a new article using req.body
    db.Comment.create(req.body)
      .then(function(dbComment) {
        // If saved successfully, send the the new Article document to the client
        console.log(
          `A comment was added to the database.\n @ ${dbComment.date}`
        );
        res.json(dbComment);
      })
      .catch(function(err) {
        // If an error occurs, send the error to the client
        res.json(err);
      });
  });

  // Test route for deleting all documents in the articles collection
  app.delete("/MOAB", (req, res) => {
    db.Article.deleteMany()
      .then(dbArticles => {
        console.log("Articles deleted.");
      })
      .catch(err => {
        res.json(err);
      });
    res.send("All Articles Have Been Deleted. I Hope That Was On Purpose!");
  });
};
