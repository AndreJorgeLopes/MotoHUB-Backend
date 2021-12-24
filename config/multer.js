const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const crypto = require("crypto");
const multer = require("multer");
const path = require("path");

cloudinary.config({
  cloud_name: "motohub",
  api_key: "422941256362536",
  api_secret: "OBNiOhOIKP45-Hii6_28dj48Wns",
});

const storageTypes = {
  local: multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.resolve(__dirname, "..", "public", "uploads"));
    },
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) cb(err);
        const fileName = `${hash.toString("hex")}-${file.originalname}`;

        cb(null, fileName);
      });
    }
  }),
  cloudinary: new CloudinaryStorage({
    cloudinary,
    params: {
      use_filename: true,
      public_id: (req, file) => {
        const hash = crypto.randomBytes(16);

        return `${hash.toString("hex")}-${path.parse(file.originalname).name}`;
      }
    }
  })
}

module.exports = {
  dest: path.resolve(__dirname, "..", "public", "uploads"),
  storage: storageTypes.cloudinary,
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      "image/jpeg",
      "image/pjpeg",
      "image/png"
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type."));
    }
  }
};