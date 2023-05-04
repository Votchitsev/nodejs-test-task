require('dotenv').config();
const express = require('express');
const sequelize = require('./database');
const auth = require('./routes/auth');
const post = require('./routes/post');
const file = require('./routes/file');

const app = express();

app.use(express.json());

app.use('/auth', auth);
app.use('/post', post);
app.use('/file', file);

app.get('/', async (req, res) => {
  await sequelize.sync({ force: true });
  res.send('DB MIGRATE');
});

module.exports = app;
