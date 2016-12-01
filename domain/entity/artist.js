const sequelize = require('sequelize');
const model = require('../../config/model');

const artist = model.define('artist', {

    name : { type : sequelize.STRING, allowNull : false },
    link : { type : sequelize.TEXT, allowNull : true },
    profile : { type : sequelize.TEXT, allowNull : true }
});

module.exports = artist;
