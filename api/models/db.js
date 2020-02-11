'user strict';
var neo4j = require('neo4j-driver');
//console.log(neo4j);
var driver = neo4j.v1.driver("bolt://localhost:7687", neo4j.v1.auth.basic("neo4j", "Superadmin"));
//var driver = neo4j.v1.driver("bolt://100.25.191.2:33813", neo4j.v1.auth.basic("neo4j", "codes-columns-appellate"));
driver.onCompleted = () => {
    console.log('Driver created');
  };
  
  driver.onError = error => {
    console.log(error);
  };

module.exports = driver;
