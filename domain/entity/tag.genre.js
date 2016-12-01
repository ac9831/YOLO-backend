const sequelize = require('sequelize');
const model = require('../../config/model');

const tag = model.define('tag_genre', { });

module.exports = tag;
