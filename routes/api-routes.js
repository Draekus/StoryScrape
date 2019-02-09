const db = require("../models/index.js");
const axios = require("axios");
const cheerio = require("cheerio");

module.exports = function(app) {
  // Main route for index page
  app.get("/", function(req, res) {
    db.Article.find({})
      .then(dbArticle => {
        res.render("index", { article: dbArticle });
      })
      .catch(err => {
        // If an error occurs, send it back to the client
        res.json(500, err);
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
        db.Article.create({
          title: title,
          url: url,
          summary: summary,
          image: image,
        })
          .then(dbArticle => {
            console.log(dbArticle);
          })
          .catch(err => {
            res.json(500, err);
          });
        results.push(result);
      });
      res.redirect("/");
    });
  });

  // Route to view saved articles
  app.get("/articles-saved", (req, res) => {
    db.Article.find({})
      .populate("comments")
      .then(dbArticle => {
        res.render("saved-articles", { article: dbArticle });
      })
      .catch(err => {
        // If an error occurs, send it back to the client
        res.json(500, err);
      });
  });

  // Route to save a specific article to the database
  app.get("/article-save/:id", (req, res) => {
    let id = req.params.id;
    let savedState;
    console.log(id);
    db.Article.findById(id)
      .then(article => {
        console.log(`
        Item with ID ${id} has a state of ${article.saved}
        `);
        savedState = article.saved;
      })
      .catch(err => {
        res.json(500, err);
      });
    db.Article.findOneAndUpdate({ _id: id }, { saved: !savedState })
      .then(dbArticle => {
        console.log(`
        Item with ID ${dbArticle.id} has changed to state ${!savedState}
        `);
        res.redirect("/");
      })
      .catch(err => {
        res.json(500, err);
      });
  });

  // Route to save a comment to a specific article
  app.post("/comment-save/:id", async (req, res) => {
    const id = req.params.id;
    const author = req.body.author;
    const text = req.body.comment;
    let commentID;
    db.Comment.create({ text: text, author: author })
      .then(dbComment => {
        commentID = dbComment._id;
        db.Article.findOneAndUpdate(
          { _id: id },
          { $push: { comments: commentID } },
          { new: true }
        )
          .then(dbArticle => {
            console.log(
              `A comment was added to the articles collection with the ID of ${commentID}`
            );
          })
          .catch(err => {
            res.json(500, err);
          });
      })
      .catch(err => {
        res.json(500, err);
      });

    res.redirect("/articles-saved");
  });

  // Route for deleting a single comment
  app.get("/comment-delete/:id", (req, res) => {
    let id = req.params.id;
    console.log(id);
    db.Comment.deleteOne({ _id: id })
      .then(dbComment => {
        console.log(dbComment);
        res.redirect("/articles-saved");
      })
      .catch(err => {
        res.json(500, err);
      });
  });
  // Route for deleting all documents in the articles collection
  app.get("/MOAB", (req, res) => {
    db.Article.deleteMany()
      .then(dbArticles => {
        console.log("Articles deleted.");
        res.redirect("/");
      })
      .catch(err => {
        res.json(500, err);
      });
  });

  // Development Routes
  // .........................................

  // Test route for adding articles to database
  app.post("/article-submit", (req, res) => {
    // Create a new article using req.body
    db.Article.create(req.body)
      .then(dbArticle => {
        // If saved successfully, send the the new Article document to the client
        console.log(
          `An article was added to the database.\n @ ${dbArticle.date}`
        );
        res.json(dbArticle);
      })
      .catch(err => {
        // If an error occurs, send the error to the client
        res.json(500, err);
      });
  });
};
