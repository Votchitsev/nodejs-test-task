const multer = require('multer');
require('dotenv').config();

const { MAX_FILE_SIZE } = process.env;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'upload');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png'
    || file.mimetype === 'image/jpg'
    || file.mimetype === 'image/jpeg') {
    return cb(null, true);
  }

  if (file.mimetype === 'audio/mpeg') {
    return cb(null, true);
  }

  if (file.mimetype === 'video/mp4') {
    return cb(null, true);
  }

  return cb(null, false);
};

function uploadFile(req, res, next) {
  const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: Number(MAX_FILE_SIZE) },
  }).single('file');

  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).send(err.message);
    }

    return next();
  });
}

module.exports = uploadFile;
