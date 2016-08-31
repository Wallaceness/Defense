'use strict';

var Sequelize = require('sequelize');

var secrets = require('./secretstuff.js');

var databaseURI = secrets.uri;

var db = new Sequelize(databaseURI, {
  define: {
    timestamps: false,
    underscored: true
  }
});

module.exports = db;
