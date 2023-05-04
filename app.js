require('dotenv').config();
const express = require('express');
const sequelize = require('./database');
const auth = require('./routes/auth');
const post = require('./routes/post');

const app = express();

app.use(express.json());

app.use('/auth', auth);
app.use('/post', post);

app.get('/', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.send('OK');
  } catch (error) {
    res.send(error);
  }
});

module.exports = app;
