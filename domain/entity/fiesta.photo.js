const sequelize = require('sequelize');
const model = require('../../config/model');

const photo = model.define('fiesta_photo', {

    path : { type : sequelize.TEXT, allowNull : false },
    description : { type : sequelize.TEXT, allowNull : true }
});

module.exports = photo;
