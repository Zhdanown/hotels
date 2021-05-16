const express = require("express");

const app = express();
const path = require("path");

const buildPath = path.join(__dirname, "..", "build");

app.use(express.static(buildPath));

const PORT = process.env.PORT || 3000;

app.get("*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`server is listening on port ${PORT}`);
});
