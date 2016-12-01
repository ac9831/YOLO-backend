const sequelize = require('sequelize');
const model = require('../../config/model');

const token = model.define('tag', {

    name : { type : sequelize.STRING, allowNull : false, unique : true },
    type : { type : model.tag, allowNull : false }
});

module.exports = token;
