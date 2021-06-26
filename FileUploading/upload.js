const bodyparser = require("body-parser");
const express = require("express");
const app = express();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyparser.json());
app.post("/upload_files", upload.array("files"), uploadFiles);
function uploadFiles(req, res) {
  console.log(req.body);
  console.log(req.files);
  res.json({ message: "Successfully uploaded files" });
}

app.listen(process.env.PORT || 3000, function (req, res) {
  console.log("Running");
});
