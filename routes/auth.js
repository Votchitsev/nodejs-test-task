const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const User = require('../models/user');
const auth = require('../middleware/auth');

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

router.post('/login', async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    if (!(email && password)) {
      return res.status(400).send('Email and password are required');
    }

    const user = await User.findOne({
      where: {
        email: {
          [Op.eq]: email,
        },
      },
    });

    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        { user_id: user.id, email },
        process.env.APP_TOKEN,
        { expiresIn: '2h' },
      );

      user.token = token;
      user.save();

      return res.status(200).json(user);
    }

    return res.status(400).send('Invalid credentials');
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.post('/logout', auth, async (req, res) => {
  try {
    req.user.token = null;
    await req.user.save();

    return res.status(200).send('User logout');
  } catch (error) {
    return res.status(500).send(error);
  }
});

module.exports = router;
