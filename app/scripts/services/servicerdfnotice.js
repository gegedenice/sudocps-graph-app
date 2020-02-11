'use strict';

/**
 * @ngdoc service
 * @name sudocpsApp.serviceRdfNotice
 * @description
 * # serviceRdfNotice
 * Factory in the sudocpsApp.
 */
angular.module('sudocpsApp')
  .factory('serviceRdfNotice', ['$http', function ($http) {
    return{
		/*fonction de récupération du fichier json*/
		recupRdf: function(url){
			return $http.get(url);
		},
		recupTitle: function(data){
			var title = data.title;
          return title;
			},
		recupDate: function(data){
			var date = data.date;
          return date;
			},	
		recupPublisher: function(data){
			var publisher = data.publisher;
          return publisher;
			},
        recupFiliation: function(data){
			var links = [];
		   var mapping = [{"P60281":"Supplément de"},{"P60259":"Supplément de"},{"P60256":"Publié avec"},{"P60245":"Mis à jour par"},{"P60303":"Met à jour"},{"P60576":"Suite de"},{"P60276":"Suite partielle de"},{"P60480":"Remplace"},{"P60479":"Remplace partiellement"},{"P60574":"Absorbe"},{"P60575":"Absorbe partiellement"},{"P60505":"Fusion de"},{"P60277":"Séparé de"},{"P60306":"Devient/Redevient"},{"P60199":"Devient partiellement"},{"P60104":"Remplacé par"},{"P60103":"Remplacé partiellement par"},{"P60247":"Absorbé par"},{"P60248":"Absorbé partiellement par"},{"P60503":"Scindé en.."},{"P60504":"Fusionne (avec...) pour donner"},{"dcterms:hasVersion":"Autre édition sur un autre support"}];
		   $.each(data, function( index, value ) {
			   var found = $.map(mapping, function(val) {
           return val[index];
            });
			   //if(index.startsWith("P60"))
			if(found != '') {	   
             links.push({type:found[0],title:value.Document.bibliographicCitation,ppn:value.Document["rdf:about"]});  
			}
            });
			return links;
		}			
		};
  }]);
