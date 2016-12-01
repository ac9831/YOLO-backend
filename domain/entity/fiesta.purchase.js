const sequelize = require('sequelize');
const model = require('../../config/model');

const photo = model.define('fiesta_purchase', {

    link : { type : sequelize.TEXT, allowNull : false }
});

module.exports = photo;
