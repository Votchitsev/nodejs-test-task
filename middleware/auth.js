const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const User = require('../models/user');

const verifyToken = async (req, res, next) => {
  const token = req.headers['x-access-token'];

  if (!token) {
    return res.status(403).send('Token has not provided');
  }

  try {
    const decoded = jwt.verify(token, process.env.APP_TOKEN);
    req.user = decoded;
    req.token = token;

    const user = await User.findOne({
      where: {
        id: {
          [Op.eq]: decoded.user_id,
        },
        token: {
          [Op.eq]: token,
        },
      },
    });

    if (!user) {
      throw new Error();
    }

    req.user = user;
  } catch (error) {
    return res.status(401).send('Invalid token');
  }

  return next();
};

module.exports = verifyToken;
