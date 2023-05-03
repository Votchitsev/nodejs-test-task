const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const User = require('../models/user');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
    } = req.body;

    if (!(email && password)) {
      res.status(400).send('Email and password inputs are required');
    }

    const existUser = await User.findOne({
      where: {
        email: {
          [Op.eq]: email,
        },
      },
    });

    if (existUser) {
      return res.status(409).send('User with this email already exists');
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: encryptedPassword,
      firstName,
      lastName,
    });

    const token = jwt.sign(
      { user_id: user.id, email },
      process.env.APP_TOKEN,
      { expiresIn: '2h' },
    );

    user.token = token;
    user.save();

    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).send(error);
  }
});

module.exports = router;
