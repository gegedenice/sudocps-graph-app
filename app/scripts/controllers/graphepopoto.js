'use strict';

/**
 * @ngdoc function
 * @name sudocpsApp.controller:GraphepopotoCtrl
 * @description
 * # GraphepopotoCtrl
 * Controller of the sudocpsApp
 */
angular.module('sudocpsApp')
  .controller('GraphepopotoCtrl', ['$scope','$http', function ($scope,$http) {
 
    popoto.rest.CYPHER_URL = "http://localhost:7474/db/data/transaction/commit";
    popoto.rest.AUTHORIZATION = "Basic " + btoa("neo4j:Superadmin");

    popoto.provider.node.Provider = {
  
        "Dpt": {
            "returnAttributes": ["name", "number"],
            "constraintAttribute": "name",
            "autoExpandRelations": true // if set to true Person nodes will be automatically expanded in graph
        },
        "Bib": {
            "returnAttributes": ["name", "rcr", "latitude", "longitude"],
            "constraintAttribute": "name",
            "autoExpandRelations": true
        },
        "Bnfrecord": {
            "returnAttributes": ["titre", "ark", "issn"],
            "constraintAttribute": "titre",
            "autoExpandRelations": true
        },
        "Sudocrecord": {
            "returnAttributes": ["titre", "ppn", "issn"],
            "constraintAttribute": "titre",
            "autoExpandRelations": true
        },
        "Numrecord": {
          "returnAttributes": ["url", "etablissement"],
          "constraintAttribute": "etablissement",
          "autoExpandRelations": true
      }
    };
    /**
     * Here a listener is used to retrieve the total results count and update the page accordingly.
     * This listener will be called on every graph modification.
     */
    popoto.result.onTotalResultCount(function (count) {
        document.getElementById("result-total-count").innerHTML = "(" + count + ")";
    });
    //popoto.query.RESULTS_PAGE_SIZE = 100;

    popoto.logger.LEVEL = popoto.logger.LogLevels.INFO;

    popoto.start("Bib");
  }]);
