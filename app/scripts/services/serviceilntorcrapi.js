'use strict';

/**
 * @ngdoc service
 * @name sudocpsApp.serviceIlntorcrApi
 * @description
 * # serviceIlntorcrApi
 * Factory in the sudocpsApp.
 */
angular.module('sudocpsApp')
  .factory('serviceIlntorcrApi', ['$http', function ($http) {
    return{
      /*fonction de récupération du fichier json*/
      recupListeRcr: function(url){
        return $http.get(url);		
      },
          recupBibs: function(data){
        var bibs = data.map(function (bib) {
          return bib   
      });
          return bibs;		 
      }
       };
  }]);
