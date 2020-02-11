'use strict';

/**
 * @ngdoc function
 * @name sudocpsApp.controller:GraphevisCtrl
 * @description
 * # GraphevisCtrl
 * Controller of the sudocpsApp
 */
angular.module('sudocpsApp')
  .controller('GraphevisCtrl', ['$scope','$http', 'serviceIlntorcrApi', 'serviceAutocompletion', function ($scope,$http, serviceIlntorcrApi, serviceAutocompletion) {

    serviceIlntorcrApi.recupListeRcr("./proxy/services/iln2rcr/230&format=text/json").
    then(function(response){
     var libraries= response.data.sudoc.query.result;
     $scope.bibs= serviceIlntorcrApi.recupBibs(libraries);
    });
    //autocompletion
    $scope.autocomplete = function(){
    serviceAutocompletion.recupListeTitre("./api/titre2unicas/"+$scope.titlesearch).
    then(function(response){
      var props = response.data.unicas
      $scope.propscomplete = serviceAutocompletion.recupRecords(props)
      console.log(response.data.unicas)
    });}
    //api unicas pour bar charts
  $scope.unicasData = $http.get("./api/unicas") 
   .then(function(response) {
    return response.data.unicas;
   })

    var viz;
    $scope.drawGraph = function(){

      var config = {
        container_id: "graphvis-container",
        //pour sandbox : server_url: "bolt://100.25.191.2:33813",
        server_url: "bolt://localhost/wsproxy",
        server_user: "neo4j",
        server_password: "Superadmin",
        labels: {
            "SudocUnica": {
                caption: "titre",
                size: "degre"
            },
            "SudocNotUnica": {
              caption: "titre",
              size: "degre"
          },
            "Bib": {
              caption: "name",
              size: "degre"
            },
            "BnfPresselocale": {
             caption: "titre",
             size: "degre"
            },
            "Dpt": {
           caption: "name",
           size: "degre"
           },
           "Numerisation": {
            caption: "url",
            size: "degre"
            }
        },
        relationships: {
            "OWNED_BY": {
              "thickness": "weight",
                "caption": false
            },
            "SAME_AS": {
              "thickness": "weight",
              "caption": false
          },
          "LOCATED": {
            "thickness": "weight",
            "caption": false
        },
        "IS_ABOUT": {
          "thickness": "weight",
          "caption": false
      },
      "HAS_VERSION": {
        "thickness": "weight",
        "caption": false
    }
        },
        arrows: true,
        initial_cypher: "CALL apoc.meta.graph()"
        //initial_cypher: "MATCH (d:Dpt)<-[l:LOCATED]-(b:Bib)<-[o:OWNED_BY]-(s)-[rel:SAME_AS]-(bnf:BnfPresselocale) OPTIONAL MATCH (bnf)-[h:HAS_VERSION]->(num:Numerisation) RETURN d,l,b,o,s,rel,bnf,h,num LIMIT 100"
    };
   
    viz = new NeoVis.default(config);
    viz.render();
    /*if(Object.keys(viz._edges).length == "0"){
      alert("pas de données")
    }*/
    }
    $scope.cypherByBib = function(rcr){
      return "MATCH (s)-[o:OWNED_BY]->(b:Bib {rcr:'"+rcr+"'})-[l:LOCATED]->(d:Dpt) OPTIONAL MATCH (s)-[rel:SAME_AS]->(bnf:BnfPresselocale)-[i:IS_ABOUT]->(de:Dpt) OPTIONAL MATCH (bnf)-[h:HAS_VERSION]->(num:Numerisation) return *";
    }
    $scope.cypherByTitle = function(id,titre){
      $scope.titlesearch = titre
      $scope.propscomplete = []
      return "MATCH (s)-[o:OWNED_BY]->(b:Bib)-[l:LOCATED]->(d:Dpt) WHERE s.initId='"+id+"' OPTIONAL MATCH (s)-[rel:SAME_AS]->(bnf:BnfPresselocale)-[i:IS_ABOUT]->(de:Dpt) OPTIONAL MATCH (bnf)-[h:HAS_VERSION]->(num:Numerisation) return *" 
    }
    //unicas exploration
    $scope.cypherUnicasAllBib = "MATCH (s:SudocUnica)-[rel:OWNED_BY]->(b:Bib) RETURN *";
    $scope.cypherUnicasAllDpt = "MATCH (s:SudocUnica)-[:OWNED_BY]->(b:Bib)-[:LOCATED]->(d:Dpt) with s,d CALL apoc.create.vRelationship(s,'LOC',{count:'1'},d) yield rel RETURN *";
    $scope.cypherUnicasPresselocale = "MATCH (b:Bib)<-[rel:OWNED_BY]-(s:SudocUnica)-[r:SAME_AS]->(bnf:BnfPresselocale) RETURN *";
    $scope.cypherUnicasNum = "MATCH (b:Bib)<-[rel:OWNED_BY]-(s:SudocUnica)-[r:SAME_AS]->(bnf:BnfPresselocale)-[relation:HAS_VERSION]->(num:Numerisation) RETURN *";
    //unicas qualité des données
    $scope.cypherUnicasSansIssn = "MATCH (s:SudocUnica)-[rel:OWNED_BY]->(b:Bib)-[r:LOCATED]->(d:Dpt) WHERE NOT EXISTS(s.issn) RETURN *";
    $scope.cypherUnicas309 = "MATCH (s:SudocUnica)-[rel:OWNED_BY]->(b:Bib)-[r:LOCATED]->(d:Dpt) WHERE EXISTS(s.controle) RETURN *";
    $scope.cypherUnicas309SansIssn = "MATCH (s:SudocUnica)-[rel:OWNED_BY]->(b:Bib)-[r:LOCATED]->(d:Dpt) WHERE NOT EXISTS(s.issn) AND EXISTS(s.controle) RETURN *";
    //presse locale exploration
    $scope.cypherPresseAllDpt = "MATCH (b:BnfPresselocale)-[rel:IS_ABOUT]->(d:Dpt) RETURN *";
    $scope.cypherPresseAllBib = "MATCH (bnf:BnfPresselocale)<-[:SAME_AS]-(s)-[:OWNED_BY]->(b:Bib) WITH bnf,b CALL apoc.create.vRelationship(bnf,'LOC',{count:'1'},b) yield rel RETURN *";
    $scope.cypherPresselocaleNum = "MATCH (n:Numerisation)<-[h:HAS_VERSION]-(bnf:BnfPresselocale) OPTIONAL MATCH (bnf)<-[rel:SAME_AS]->(s)-[o:OWNED_BY]->(b:Bib) RETURN *";   
    $scope.cypherPresseNoSudoc = "MATCH (bnf:BnfPresselocale)-[i:IS_ABOUT]->(d:Dpt) WHERE NOT exists ((bnf)<-[:SAME_AS]-()) return *"

    $scope.reloadGraph = function(cypher,param){
      viz.renderWithCypher(cypher);
     // console.log($scope.unicasData.$$state.value)
    }
    $scope.stabilize = function(){
      viz.stabilize();
    }
    $scope.clear = function(){
      viz.clearNetwork();
    }
    $scope.drawGraph();

  $scope.$on('$locationChangeStart', function( event ) {
    viz.clearNetwork();
});

$scope.getBarChart = function(data,critere){
  $scope.keys = [];
  $scope.values = [];
  $scope.barData = $filter('countBy')($scope.datas, "loc.name");
  $scope.orderBardata = Object.keys($scope.barData).map(key => ({ key: key, value: $scope.barData[key] })).sort((first, second) => (first.value < second.value) ? -1 : (first.value > second.value) ? 1 : 0 );
  console.log($scope.barData)
  console.log($scope.orderBardata);
  angular.forEach($scope.barData, function(value, key) {
    $scope.keys.push(key);
    $scope.values.push(value);
  });
}
  }]);
