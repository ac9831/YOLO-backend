const sequelize = require('sequelize');
const model = require('../../config/model');

const compose = model.define('track_compose', { });

module.exports = compose;
