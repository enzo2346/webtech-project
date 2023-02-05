// Import modules
const express = require("express");
const handles = require("./routes");

const app = express();
const port = 8080;

app.use("/", handles);

app.listen(port, () => {
  console.log(`Blogging app listening on port ${port}`);
});
