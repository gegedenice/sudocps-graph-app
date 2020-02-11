'use strict';

/**
 * @ngdoc service
 * @name sudocpsApp.serviceAutocompletion
 * @description
 * # serviceAutocompletion
 * Factory in the sudocpsApp.
 */
angular.module('sudocpsApp')
  .factory('serviceAutocompletion', ['$http', function ($http) {
    return{
      /*fonction de récupération du fichier json*/
      recupListeTitre: function(url){
        return $http.get(url);		
      },
          recupRecords: function(data){
        var records = data.map(function (record) {
          return {"titre":record.record.titre,"id":record.record.initId}  
      });
          return records;		 
      }
       };
  }]);