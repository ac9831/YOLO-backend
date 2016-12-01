const sequelize = require('sequelize');
const model = require('../../config/model');

const user = model.define('user', {

    name : { type : sequelize.STRING, allowNull : false },
    birth : { type : sequelize.DATEONLY, allowNull : false },
    gender : { type : model.gender, allowNull : false },
    profile : { type : sequelize.TEXT, allowNull : true }
});

module.exports = user;
