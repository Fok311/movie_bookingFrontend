const express = require("express");
// setup router
const router = express.Router();

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploadsBanner/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/", upload.single("banner"), async (req, res) => {
  try {
    // get the image url from multer
    const banner_url = req.file.path;
    // send back the image url
    res.status(200).send({ banner_url: banner_url });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

module.exports = router;
