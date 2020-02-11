'use strict';

/**
 * @ngdoc service
 * @name sudocpsApp.serviceMultiwhereApi
 * @description
 * # serviceMultiwhereApi
 * Factory in the sudocpsApp.
 */
angular.module('sudocpsApp')
  .factory('serviceMultiwhereApi', ['$http', function ($http) {
       return{
		/*fonction de récupération du fichier json*/
		recupMultiwhere: function(url){
			return $http.get(url);		
		},
        recupLocs: function(data){
			var locs = [];
		 $.each(data, function(value ) {
           locs.push({loc:value});
		 });
        return locs;		 
		}
	   };
  }]);
