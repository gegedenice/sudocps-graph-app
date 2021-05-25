'user strict';
var neo4j = require('neo4j-driver');
var driver = require('./db.js');

exports.presselocale = function (req, res) {
    var presselocale = {};var content = [];
    presselocale.presselocale = content;
    var session = driver.session({ defaultAccessMode: neo4j.session.READ });
    // Run a Cypher statement, reading the result in a streaming manner as records arrive:
    session
   .run("MATCH (bnf:BnfPresselocale)-[:IS_ABOUT]->(d:Dpt) OPTIONAL MATCH (s)-[:SAME_AS]->(bnf) OPTIONAL MATCH (b:Bib)<-[:OWNED_BY]-(s) OPTIONAL MATCH (bnf)-[:HAS_VERSION]->(n:Numerisation) WITH bnf,s,collect(DISTINCT d) as dpts,collect(DISTINCT b) as bib,collect(DISTINCT n) as num RETURN bnf,dpts,s,bib,num")
  .subscribe({
        onNext: function (record) {
            //content.push({count:record._fields.filter(Boolean).length,record:record})
             var dpts = record._fields[1].map(function(item){return item.properties})
             var bibs = record._fields[3].map(function(item){return item.properties})
             var nums = record._fields[4].map(function(item){return item.properties})
            if(record._fields.filter(Boolean).length == "4" && nums.length == "0")
             content.push({record:record._fields[0].properties,depts_about:dpts});
             else if (record._fields.filter(Boolean).length == "4" && nums.length != "0")
             content.push({record:record._fields[0].properties,depts_about:dpts,numerisation:nums});
             if(record._fields.filter(Boolean).length == "5" && record._fields[2] != null && nums.length == "0")
             content.push({record:record._fields[0].properties,depts_about:dpts,sudoc_record:Object.assign(record._fields[2].properties,{"url":"http://www.sudoc.fr/"+record._fields[2].properties.ppn}),sudoc_locs:bibs});
             else if (record._fields.filter(Boolean).length == "5" && record._fields[2] != null && nums.length != "0")
              content.push({record:record._fields[0].properties,depts_about:dpts,sudoc_record:Object.assign(record._fields[2].properties,{"url":"http://www.sudoc.fr/"+record._fields[2].properties.ppn}),sudoc_locs:bibs,numerisation:nums});          
        },
        onCompleted: function () {
            // Completed!
            session.close();
            res.send(presselocale);
        },
        onError: function (error) {
            console.log(error);
        }
    });
  };

  exports.presselocaleByRcr = function (req, res) {
    //cyper multi params : match (n:Sudocrecord)-[r:OWNED_BY]->(b:Bib) WHERE b.rcr IN ["060885101","060886101"] return n,r,b
    var presselocale = {"query":{"rcr":req.params.rcr}};var content = [];
    console.log(presselocale)
    presselocale.presselocale = content;
    var session = driver.session({ defaultAccessMode: neo4j.session.READ });
  // Run a Cypher statement, reading the result in a streaming manner as records arrive:
  session
  .run("MATCH (b:Bib {rcr:$rcrParam})<-[:OWNED_BY]-(s)-[:SAME_AS]->(bnf:BnfPresselocale)-[:IS_ABOUT]->(d:Dpt) OPTIONAL MATCH (bnf)-[:HAS_VERSION]->(n:Numerisation) WITH bnf,s,collect(DISTINCT d) as dpts,collect(DISTINCT b) as bib,collect(DISTINCT n) as num RETURN bnf,dpts,s,bib,num",{rcrParam: req.params.rcr})
.subscribe({
      onNext: function (record) {
        var dpts = record._fields[1].map(function(item){return item.properties})
        var bibs = record._fields[3].map(function(item){return item.properties})
        var nums = record._fields[4].map(function(item){return item.properties})
       if(record._fields.filter(Boolean).length == "4" && nums.length == "0")
        content.push({record:record._fields[0].properties,depts_about:dpts});
        else if (record._fields.filter(Boolean).length == "4" && nums.length != "0")
        content.push({record:record._fields[0].properties,depts_about:dpts,numerisation:nums});
        if(record._fields.filter(Boolean).length == "5" && record._fields[2] != null && nums.length == "0")
        content.push({record:record._fields[0].properties,depts_about:dpts,sudoc_record:Object.assign(record._fields[2].properties,{"url":"http://www.sudoc.fr/"+record._fields[2].properties.ppn}),sudoc_locs:bibs});
        else if (record._fields.filter(Boolean).length == "5" && record._fields[2] != null && nums.length != "0")
         content.push({record:record._fields[0].properties,depts_about:dpts,sudoc_record:Object.assign(record._fields[2].properties,{"url":"http://www.sudoc.fr/"+record._fields[2].properties.ppn}),sudoc_locs:bibs,numerisation:nums});     
      },
      onCompleted: function () {
          // Completed!
          session.close();
          res.send(presselocale);
      },
      onError: function (error) {
          console.log(error);
      }
  });
};