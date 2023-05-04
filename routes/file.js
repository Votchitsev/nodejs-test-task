const multer = require('multer');
const express = require('express');
const path = require('path');
const File = require('../models/file');
const auth = require('../middleware/auth');
const checkFileSize = require('../middleware/checkFileSize');
const fileFilter = require('../utils/fileFilter');

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
  multer({ storage, fileFilter }).single('file'),
  auth,
  checkFileSize,
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).send('bad request');
      }

      const filePath = `${req.file.destination}/${req.file.filename}`;

      const file = await File.create({
        name: req.file.filename,
        path: filePath,
      });

      await file.save();

      return res.status(201).json(file);
    } catch (error) {
      return res.status(500).send(error);
    }
  },
);

router.get('/download', async (req, res) => {
  try {
    const { id } = req.body;
    const file = await File.findByPk(id);

    if (!file) {
      return res.status(401).send('File not found');
    }

    return res.sendFile(path.join(__dirname, '../', file.path));
  } catch (error) {
    return res.send(500).send(error);
  }
});

module.exports = router;
