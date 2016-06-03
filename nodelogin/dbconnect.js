var mysql = require('mysql');
var dbConfig = require('./credentials').dbConfig;
var pool = mysql.createPool(dbConfig);
module.exports = pool;
