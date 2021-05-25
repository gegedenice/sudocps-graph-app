'user strict';
require('dotenv').config({ path: './.env' });
var neo4j = require('neo4j-driver');

var driver = neo4j.driver(
  'bolt://localhost:'+process.env.DB_PORT,
  neo4j.auth.basic(process.env.DB_USER, process.env.DB_PASSWORD)
)
driver.onCompleted = () => {
    console.log('Driver created');
  };
  
  driver.onError = error => {
    console.log(error);
  };

module.exports = driver;
