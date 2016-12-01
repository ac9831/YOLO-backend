const resources = require('./resources');
const sequelize = require('sequelize');
const database = resources.database;

const model = new sequelize('yolo', database.username, database.password, {

    host : database.url,
    dialect : 'mysql'
});

model.device = sequelize.ENUM('android', 'ios', 'web');
model.gender = sequelize.ENUM('male', 'female');
model.purpose = sequelize.ENUM('fiesta_changes', 'fiesta_suggest', 'artist_suggest', 'track_suggest');
model.status = sequelize.ENUM('attend', 'like', 'none');
model.tag = sequelize.ENUM('artist', 'genre', 'hashtag');

module.exports = model;
