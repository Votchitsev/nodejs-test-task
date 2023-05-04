const checkFileSize = (req, res, next) => {
  if (req.file && req.file.size > 10485760) {
    return res.status(400).send('Too large file');
  }

  return next();
};

module.exports = checkFileSize;
