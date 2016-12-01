const sequelize = require('sequelize');
const model = require('../../config/model');

const perform = model.define('fiesta_perform', {

    startTime : { type : sequelize.DATE, allowNull : true },
    endTime : { type : sequelize.DATE, allowNull : true },

    stage : { type : sequelize.TEXT, allowNull : true },
    headliner : { type : sequelize.BOOLEAN, allowNull : false }
});

module.exports = perform;
