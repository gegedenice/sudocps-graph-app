'user strict';
var driver = require('./db.js');

exports.unicas = function (req, res) {
    var unicas = {};var content = [];
    unicas.unicas = content;
    //var unicas = [];
    var session = driver.session();
    // Run a Cypher statement, reading the result in a streaming manner as records arrive:
    session
   .run("MATCH (s:SudocUnica)-[r:OWNED_BY]->(b:Bib)-[:LOCATED]->(d:Dpt) OPTIONAL MATCH (s)-[:SAME_AS]->(bnf:BnfPresselocale) OPTIONAL MATCH (bnf)-[:HAS_VERSION]->(num:Numerisation) RETURN s,r,b,bnf,num")
  .subscribe({
        onNext: function (record) {
            //content.push({record:record})
            if(record._fields.filter(Boolean).length == "3")
            {content.push({record:record._fields[0].properties,loc:Object.assign(record._fields[2].properties, record._fields[1].properties)});}
            else if(record._fields.filter(Boolean).length == "4") 
            {content.push({record:record._fields[0].properties,loc:Object.assign(record._fields[2].properties, record._fields[1].properties),ark_bnf:record._fields[3].properties.ark,url_presselocale:"http://presselocaleancienne.bnf.fr"+record._fields[3].properties.ark});}
            else if(record._fields.filter(Boolean).length == "5") 
            {content.push({record:record._fields[0].properties,loc:Object.assign(record._fields[2].properties, record._fields[1].properties),ark_bnf:record._fields[3].properties.ark,url_presselocale:"http://presselocaleancienne.bnf.fr"+record._fields[3].properties.ark,numerisation:record._fields[4].properties});}
        },
        onCompleted: function () {
            // Completed!
            session.close();
            res.send(unicas);
        },
        onError: function (error) {
            console.log(error);
        }
    });
  };

  exports.unicasByRcr = function (req, res) {
      //cyper multi params : match (n:Sudocrecord)-[r:OWNED_BY]->(b:Bib) WHERE b.rcr IN ["060885101","060886101"] return n,r,b
      var unicas = {"query":{"rcr":req.params.rcr}};var content = [];
    unicas.unicas = content;
    var session = driver.session();
    // Run a Cypher statement, reading the result in a streaming manner as records arrive:
    session
    .run("MATCH (s:SudocUnica)-[r:OWNED_BY]->(b:Bib {rcr:{rcrParam}}) OPTIONAL MATCH (s)-[:SAME_AS]->(bnf:BnfPresselocale) OPTIONAL MATCH (bnf)-[:HAS_VERSION]->(num:Numerisation) RETURN s,r,b,bnf,num",{rcrParam: req.params.rcr})
  .subscribe({
        onNext: function (record) {
            if(record._fields.filter(Boolean).length == "3")
            {content.push({record:record._fields[0].properties,loc:Object.assign(record._fields[2].properties, record._fields[1].properties)});}
            else if(record._fields.filter(Boolean).length == "4") 
            {content.push({record:record._fields[0].properties,loc:Object.assign(record._fields[2].properties, record._fields[1].properties),ark_bnf:record._fields[3].properties.ark,url_presselocale:"http://presselocaleancienne.bnf.fr"+record._fields[3].properties.ark});}
            else if(record._fields.filter(Boolean).length == "5") 
            {content.push({record:record._fields[0].properties,loc:Object.assign(record._fields[2].properties, record._fields[1].properties),ark_bnf:record._fields[3].properties.ark,url_presselocale:"http://presselocaleancienne.bnf.fr"+record._fields[3].properties.ark,numerisation:record._fields[4].properties});}
        },
        onCompleted: function () {
            // Completed!
            session.close();
            res.send(unicas);
        },
        onError: function (error) {
            console.log(error);
        }
    });
  };

 exports.unicasByTitle = function (req, res) {
    var unicas = {"query":{"title":req.params.title}};var content = [];
  unicas.unicas = content;
  var session = driver.session();
  // Run a Cypher statement, reading the result in a streaming manner as records arrive:
  session
  //.run("MATCH (s) WHERE s.titre CONTAINS {titleParam} RETURN s",{titleParam: req.params.title})
  .run("MATCH (s) WHERE LOWER(s.titre) CONTAINS LOWER({titleParam}) RETURN DISTINCT(s)",{titleParam: req.params.title})
.subscribe({
      onNext: function (record) {
          //content.push(record)
          content.push({record:record._fields[0].properties});
      },
      onCompleted: function () {
          // Completed!
          session.close();
          res.send(unicas);
      },
      onError: function (error) {
          console.log(error);
      }
  });
};