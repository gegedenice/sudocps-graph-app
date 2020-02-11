'use strict';

/**
 * @ngdoc function
 * @name sudocpsApp.controller:RecordCtrl
 * @description
 * # RecordCtrl
 * Controller of the sudocpsApp
 */
angular.module('sudocpsApp')
  .controller('RecordCtrl', ['$scope', '$http', '$routeParams','$sceDelegate', 'serviceUnimarcNotice', 'serviceRdfNotice', 'serviceMultiwhereApi',
  function($scope, $http, $routeParams,$sceDelegate,serviceUnimarcNotice,serviceRdfNotice,serviceMultiwhereApi) {
	//config du réseau
	var nodes = new vis.DataSet();
    var edges = new vis.DataSet();
	  var container = document.getElementById('mynetwork');
  var data = {
    nodes: nodes,
    edges: edges
  };
  var options = {
			interaction:{hover:true, navigationButtons: true},
			edges: {
				font: {
				  size: 12
				},
				widthConstraint: {
				  maximum: 90
				}
			  },
			  nodes: {
				shape: 'box',
				margin: 10,
				widthConstraint: {
				  maximum: 200
				}
			  },
				physics: {
					enabled: false
				}	
		};
  var network = new vis.Network(container, data, options);
      //Survol d'un noeud
    network.on("hoverNode", function (params) {
	document.getElementById("eventSpan").innerHTML = "";
	document.getElementById("eventSpanLocs").innerHTML = "";
	document.getElementById("eventSpanPeriscope").innerHTML = "";
     params.event = "[original event]";
        $("#eventSpan").append(params.node);
		$("#eventSpanPeriscope").append('<a href="https://periscope.sudoc.fr/?ppnviewed='+params.node+'" target="_blanck">Lien Périscope</a>');
        getLocs(params.node);		
    });	
	//click sur un noeud
    network.on("selectNode", function (params) {
		createGraphBranch(params.nodes[0]);
    });
	  //recup du ppn en route param
    $scope.ppn = $routeParams.ppn;
	//requête notice rdf pour récup des données bibs + création 1er noeud + 1ères filiations
	//serviceRdfNotice.recupRdf("http://www.sudoc.fr/" + $scope.ppn + ".rdf").
	serviceRdfNotice.recupRdf("./sudoc/" + $scope.ppn + ".rdf").
	then(function(response){
		console.log($.xml2json($.parseXML(response.data)));
	var fields = $.xml2json($.parseXML(response.data)).Periodical;
    console.log(fields);
    $scope.title= serviceRdfNotice.recupTitle(fields);
    $scope.date= serviceRdfNotice.recupDate(fields);
    $scope.publisher= serviceRdfNotice.recupPublisher(fields);
	nodes.add([{id: $scope.ppn, label: $scope.title}]);
    createGraphBranch($scope.ppn);
	});

	function createGraphBranch(ppn){
	//serviceRdfNotice.recupRdf("https://www.sudoc.fr/" + $scope.ppn + ".rdf").
	serviceRdfNotice.recupRdf("./sudoc/" + ppn + ".rdf").
	then(function(response){
	var fieldsFiliation = $.xml2json($.parseXML(response.data)).Periodical;
    angular.forEach(serviceRdfNotice.recupFiliation(fieldsFiliation), function(value, key){
    nodes.add([{id: ((((value.ppn).split("https://www.sudoc.fr/"))[1]).split("/"))[0], label: value.title}]); 
    edges.add([{from: ppn, to: ((((value.ppn).split("https://www.sudoc.fr/"))[1]).split("/"))[0], label: value.type, arrows:'to'}]);	
         });
  });
	}
	function getLocs(ppn){
	serviceMultiwhereApi.recupMultiwhere("https://www.sudoc.fr/services/multiwhere/"+ppn).
	then(function(response){
   var libraries= response.data.sudoc.query.result.library;
	//if(libraries.length !== "undefined") {
		if($.isArray(libraries)) {
			$.each(libraries, function( idx, obj) {
	 $.each(obj, function(key, value) {
    if(key == "shortname"){
   $("#eventSpanLocs").append('<a ng-href="" class="collection-item">'+value+'</a>');
   }
});	
	});			
	}
	else{
$("#eventSpanLocs").append('<a ng-href="" class="collection-item">'+libraries.shortname+'</a>');
	}
	});	
		
	}
  }]);
