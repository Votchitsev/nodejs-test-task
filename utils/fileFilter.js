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

module.exports = fileFilter;
