require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const auth = require('./routes/auth');
const post = require('./routes/post');
const file = require('./routes/file');

const app = express();

app.use(express.json());

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'access-token', 'Access-Control-Allow-Origin'],
}));

app.use('/auth', auth);
app.use('/post', post);
app.use('/file', file);

app.get('/', async (req, res) => {
  res.sendFile(path.join(__dirname, 'templates/about.html'));
});

module.exports = app;
