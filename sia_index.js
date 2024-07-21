'use strict';

const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const User = require("./user");
const Point = require("./point");
const Profile = require("./profile");
const QnA = require("./qna");
const Answer = require("./anwer");
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.User = User;
db.Point = Point;
db.Profile = Profile;
db.QnA = QnA;
db.Answer = Answer;

User.initiate(sequelize);
Point.initiate(sequelize);
Profile.initiate(sequelize);
QnA.initiate(sequelize);
Answer.initiate(sequelize);

db.sequelize = sequelize;

module.exports = db;
