const express = require('express');
const { Op } = require('sequelize');
const fs = require('fs');
const auth = require('../middleware/auth');
const Post = require('../models/post');
const File = require('../models/file');

const router = express.Router();

router.post('/create', auth, async (req, res) => {
  try {
    const { message, fileId } = req.body;

    const post = await Post.create({
      message,
      UserId: req.user.id,
    });

    await post.save();

    if (fileId) {
      const file = await File.findByPk(fileId);

      file.PostId = post.id;
      await file.save();
    }

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
      include: [{
        model: File,
      }],
    });

    return res.status(200).json(postList);
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.put('/update', auth, async (req, res) => {
  try {
    const {
      postId,
      message,
      prevFileId,
      newFileId,
    } = req.body;

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

    if (message) {
      post.message = message;
    }

    if (prevFileId && newFileId) {
      const prevFile = await File.findByPk(prevFileId);
      const newFile = await File.findByPk(newFileId);

      await prevFile.destroy();

      newFile.PostId = post.id;
      newFile.save();

      fs.unlink(prevFile.path, (err) => {
        if (err) throw new Error(err);
      });
    }

    await post.save();

    return res.status(201).json(post);
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.delete('/delete', auth, async (req, res) => {
  try {
    const { postId } = req.body;

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

    const files = await File.findAll({
      where: {
        PostId: {
          [Op.eq]: postId,
        },
      },
    });

    if (files) {
      files.forEach(
        (file) => {
          file.destroy();
          fs.unlink(file.path, (err) => {
            if (err) throw new Error(err);
          });
        },
      );
    }

    await post.destroy();

    return res.status(200).send('Removed');
  } catch (error) {
    return res.status(500).send(error);
  }
});

module.exports = router;
