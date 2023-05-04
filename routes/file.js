const multer = require('multer');
const express = require('express');
const File = require('../models/file');
const auth = require('../middleware/auth');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'upload');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

router.post(
  '/upload',
  multer({ storage, limits: { fileSize: 3145728 } }).single('file'),
  auth,
  async (req, res) => {
    try {
      const path = `${req.file.destination}/${req.file.filename}`;

      const file = await File.create({
        name: req.file.filename,
        path,
      });

      await file.save();

      return res.status(201).json(file);
    } catch (error) {
      return res.status(500).send(error);
    }
  },
);

module.exports = router;
