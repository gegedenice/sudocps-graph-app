'user strict';
var driver = require('./db.js');
/*--- middleware between front and neo4j database for data flow----*/

/*---- data middleware for graph ---*/
exports.data2graph = function (req, res) {
    //cyper multi params : match (n:Sudocrecord)-[r:OWNED_BY]->(b:Bib) WHERE b.rcr IN ["060885101","060886101"] return n,r,b
   var q = req.body
   var content = [];
  var session = driver.session();
  // Run a Cypher statement, reading the result in a streaming manner as records arrive:
  session
  .run(q)
.subscribe({
      onNext: function (record) {
          content.push(record)
      },
      onCompleted: function () {
          // Completed!
          session.close();
          res.send(content);
      },
      onError: function (error) {
          console.log(error);
      }
  });
};