const multer = require("multer");

const getDate = new Date().toLocaleString().split(", ");
const date = getDate[0].split("/");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public");
  },
  filename: (req, file, cb) => {
    const split = file.originalname.split(".");
    cb(
      null,
      "" +
        date.join("") +
        "_" +
        Math.round(Math.random() * 1000000) +
        "." +
        split[split.length - 1]
    );
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
