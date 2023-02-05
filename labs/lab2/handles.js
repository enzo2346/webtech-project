const url = require("url");
const qs = require("querystring");
const fs = require("fs");
const path = require("path");

module.exports = {
  serverHandle: async function (req, res) {
    const route = url.parse(req.url);
    const path = route.pathname;
    const params = qs.parse(route.query);

    if (path === "/") {
      res.writeHead(200, { "Content-Type": "text/html" });
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
      res.write(content);
    } else if (path === "/hello") {
      res.writeHead(200, { "Content-Type": "text/plain" });
      if ("name" in params) {
        if (params["name"] === "enzo") {
          res.write("Hello i'm enzo and i'm a student at the ECE school");
        } else {
          res.write("Hello " + params["name"]);
        }
      } else {
        res.write("Hello Anonymous !");
      }
    } else {
      try {
        const data = require(`./content/${path}.json`);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify(data));
      } catch (err) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.write("Error 404! The page doesn't exist.");
      }
    }
    res.end();
  },
};
