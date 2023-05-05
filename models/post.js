const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const User = require('./user');
const File = require('./file');

const Post = sequelize.define('Post', {
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

Post.belongsTo(User);
User.hasMany(Post);

File.belongsTo(Post);
Post.hasMany(File);

module.exports = Post;
