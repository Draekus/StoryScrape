const db = require("../models/index.js");
const axios = require("axios");
const cheerio = require("cheerio");
const Article = require("../models/Article");
const Comment = require("../models/Comment");

module.exports = function(app) {
  // Main route for index page
  app.get("/", function(req, res) {
    db.Article.find({})
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
    axios.get("https://www.rockpapershotgun.com/").then(response => {
      const $ = cheerio.load(response.data);
      let results = [];
      console.log("Searching For Articles");
      $(".blog-post").each(function(i, element) {
        let url = $(element)
          .find(".title")
          .children()
          .attr("href");
        let title = $(element)
          .find(".title")
          .children()
          .text();
        let summary = $(element)
          .find(".excerpt")
          .text();
        let image = $(element)
          .find(".alignnone")
          .attr("src");
        let result = {
          url: url,
          title: title,
          summary: summary,
          image: image,
        };
        // console.log(url);
        // console.log(title);
        // console.log(summary);
        // console.log(image);
        db.Article.create({
          title: title,
          url: url,
          summary: summary,
          image: image,
        })
          .then(dbArticle => {
            console.log(dbArticle);
          })
          .catch(function(err) {
            res.json(err);
          });
        results.push(result);
      });
      res.json(results);
    });
  });

  app.get("/articles-saved", (req, res) => {
    db.Article.find({})
      .populate("comments")
      .then(function(dbArticle) {
        res.render("saved-articles", { article: dbArticle });
      })
      .catch(function(err) {
        // If an error occurs, send it back to the client
        res.json(err);
      });
  });

  app.post("/article-save/:id", (req, res) => {
    let id = req.params.id;
    let savedState;
    console.log(id);
    // db.Article.findById(id)
    //   .then(article => {
    //     console.log(`
    //     Item with ID ${id} has a state of ${article.saved}
    //     `);
    //     savedState = article.saved;
    //   })
    //   .catch(err => {
    //     res.json(err);
    //   });
    // db.Article.findOneAndUpdate({ _id: id }, { saved: !savedState })
    //   .then(dbArticle => {
    //     console.log(`
    //     Item with ID ${dbArticle.id} has changed to state ${dbArticle.saved}
    //     `);
    //     res.redirect("/");
    //   })
    //   .catch(err => {
    //     res.json(err);
    //   });
  });

  // Route for deleting all documents in the articles collection
  app.get("/MOAB", (req, res) => {
    db.Article.deleteMany()
      .then(dbArticles => {
        console.log("Articles deleted.");
        res.redirect("/");
      })
      .catch(err => {
        res.json(err);
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

  app.post("/comment-submit/:id", async (req, res) => {
    const id = req.params.id;
    console.log(`id: ${id}`);
    const { name, comment } = req.body;
    console.log(name, comment);
    db.Comment.create({ text: comment, author: name })
      .then(dbComment => {
        console.log(dbComment.text);
      })
      .catch(err => {
        res.json(err);
      });
    console.log(newNote);
    await db.Review.findOneAndUpdate(
      { _id: id },
      { notes: newNote._id },
      { new: true }
    );

    res.redirect("/");
  });
};
