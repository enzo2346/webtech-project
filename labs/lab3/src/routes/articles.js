const article = require("express").Router();
const db = require("../db");

//API routes articles
article.route("/").get((req, res) => {
  res.send(db.articles);
});

article.route("/").post((req, res) => {
  const newarticle = db.articles.push({
    id: "8ec0bd7f-11c0-43da-975e-2a8ad9ebae0b",
    title: "My article3",
    content: "Content of the article3.",
    date: "04/10/2022",
    author: "Liz Gringer",
  });
  res.send("ok");
});

article.route("/:articleId").get((req, res) => {
  const article = db.articles.find(
    (article) => article.id === req.params.articleId
  );
  if (article) res.send(article);
  else res.sendStatus(404);
});

//API routes comments
article.route("/:articleId/comments").get((req, res) => {
  const comment = db.comments.find(
    (comments) => comments.articleId === req.params.articleId
  );
  if (comment) res.send(comment);
  else res.sendStatus(404);
});

article.route("/:articleId/comments").post((req, res) => {
  const newcomment = db.comments.push({
    id: "1b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    timestamp: 1664835049,
    content: "Content of the comment2.",
    articleId: "7ec0bd7f-11c0-43da-975e-2a8ad9ebae0b",
    author: "Peter",
  });
  res.send("ok");
});

article.route("/:articleId/comments/:commentsId").get((req, res) => {
  const comment = db.comments.find(
    (comments) =>
      comments.articleId === req.params.articleId &&
      comments.id === req.params.commentsId
  );
  if (comment) res.send(comment);
  else res.sendStatus(404);
});

module.exports = article;
