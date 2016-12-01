const sequelize = require('sequelize');
const model = require('../../config/model');

const authentication = model.define('auth_facebook', {

    facebookId : { type : sequelize.STRING, allowNull : false }
});

module.exports = authentication;
