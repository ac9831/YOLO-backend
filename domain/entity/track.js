const sequelize = require('sequelize');
const model = require('../../config/model');

const track = model.define('track', {

    rank : { type : sequelize.INTEGER, allowNull : false },
    title : { type : sequelize.STRING, allowNull : false },

    release : { type : sequelize.DATEONLY, allowNull : true },

    link : { type : sequelize.TEXT, allowNull : false },
    dropAt : { type : sequelize.INTEGER, allowNull : false }
});

module.exports = track;
