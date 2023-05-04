const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const User = require('./user');

const Post = sequelize.define('Post', {
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

Post.belongsTo(User);
User.hasMany(Post);

sequelize.sync({ force: true });

module.exports = Post;
