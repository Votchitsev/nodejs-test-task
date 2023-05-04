const express = require('express');
const { Op } = require('sequelize');
const auth = require('../middleware/auth');
const Post = require('../models/post');

const router = express.Router();

router.post('/create', auth, async (req, res) => {
  try {
    const { message } = req.body;

    const post = await Post.create({
      message,
      UserId: req.user.id,
    });

    await post.save();

    return res.status(201).json(post);
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.get('/list', async (req, res) => {
  try {
    const { page } = req.query;

    const postList = await Post.findAndCountAll({
      limit: 20,
      offset: (page - 1) * 20,
    });

    return res.status(200).json(postList);
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.put('/update', auth, async (req, res) => {
  try {
    const { postId, message } = req.body;

    const post = await Post.findOne({
      where: {
        id: {
          [Op.eq]: postId,
        },
        UserId: {
          [Op.eq]: req.user.id,
        },
      },
    });

    if (!post) {
      return res.status(401).send('The post not found');
    }

    post.message = message;
    await post.save();

    return res.status(201).json(post);
  } catch (error) {
    return res.status(500).send(error);
  }
});

module.exports = router;
