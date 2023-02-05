const articles = require("./articles");
const router = require("express").Router();

router.use("/articles", articles);

// define the home page route
router.get("/", (req, res) => {
  const content =
    "<!DOCTYPE html>" +
    "<html>" +
    "    <head>" +
    '        <meta charset="utf-8" />' +
    "        <title>Web Technologies project</title>" +
    "    </head>" +
    "    <body>" +
    "       <h1>Web Technologies project</h1>" +
    "       <h2>Usage instructions</h2>" +
    "       <ul>" +
    '           <li>Go to the <a href="/hello">"Hello page"</a> to greet anonymous person.</li>' +
    '           <li>Use the "<code>name</code>" query parameter to personalize the hello message. For example, <a href="/hello?name=Steve">greet Steve</a>.</li>' +
    '           <li>Use "<code>?name=Peter</code>" to show an info about Enzo. Go to the <a href="/hello?name=enzo">Enzo\'s page</a>.</li>' +
    '           <li>Content pages: <a href="/about">About</a>, <a href="/contacts">Contacts</a></li>' +
    '           <li>Other pages will respond with 404 error. For example, go to <a href="/random-page">this random page</a>.</li>' +
    "       </ul>" +
    "    </body>" +
    "</html>";
  res.send(content);
  // res.sendFile(path.join(__dirname, "/index.html"));
});

// define the about route
router.get("/hello", (req, res) => {
  if (req.query.name == "enzo") {
    res.send("Hello i'm enzo and i'm a student at the ECE school");
  } else if (req.query.name !== "" && typeof req.query.name === "string") {
    res.send("Hello " + req.query.name);
  } else {
    res.send("Hello Anonymous !");
  }
});

router.get("*", (req, res) => {
  try {
    const data = require(`../../content/${req.url}.json`);
    res.json(data);
  } catch (err) {
    res.status(404).send("Error 404! The page doesn't exist.");
  }
});

router.get("/*", (req, res) => {
  res.send("Error 404! The page doesn't exist.");
});

module.exports = router;
