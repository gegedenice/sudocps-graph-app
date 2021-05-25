'user strict';
var neo4j = require('neo4j-driver');
var driver = require('./db.js');
/*--- middleware between front and neo4j database for data flow----*/

/*---- data middleware for graph ---*/
exports.data2graph = function (req, res) {
    console.log(req.body)
    //cyper multi params : match (n:Sudocrecord)-[r:OWNED_BY]->(b:Bib) WHERE b.rcr IN ["060885101","060886101"] return n,r,b
   var query = req.body.q
   var content = [];
   var session = driver.session({ defaultAccessMode: neo4j.session.READ });
  session
  .run(query) //the cypher query must be structured with a result like {"records":{"sources":...},"targets":...}
.subscribe({
      onNext: function (record) {
         content.push(record)
         //content.push({"source":record._fields[0],"target":record._fields[1],"link":record._fields[2]})
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

