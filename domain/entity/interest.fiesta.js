const sequelize = require('sequelize');
const model = require('../../config/model');

const interest = model.define('interest_fiesta', {

    state : { type : model.status, allowNull : false },
});

module.exports = interest;
