const sequelize = require('sequelize');
const model = require('../../config/model');

const fiesta = model.define('fiesta', {

    name : { type : sequelize.STRING, allowNull : false },
    facade : { type : sequelize.TEXT, allowNull : true },
    description : { type : sequelize.TEXT, allowNull : true },

    startTime : { type : sequelize.DATE, allowNull : true },
    endTime : { type : sequelize.DATE, allowNull : true },

    location : { type : sequelize.STRING, allowNull : true },
    geolocation : { type : sequelize.GEOMETRY, allowNull : true }
});

module.exports = fiesta;
