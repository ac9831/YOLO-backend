const sequelize = require('sequelize');
const model = require('../../config/model');

const host = model.define('holder_host', { });

module.exports = host;
