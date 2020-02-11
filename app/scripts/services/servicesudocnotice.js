'use strict';

/**
 * @ngdoc service
 * @name sudocpsApp.serviceSudocNotice
 * @description
 * # serviceSudocNotice
 * Factory in the sudocpsApp.
 */
angular.module('sudocpsApp')
  .factory('serviceSudocNotice',['$http', function ($http) {
    return{
		/*fonction de récupération du fichier json*/
		recupRdf: function(url){
			return $http.get(url);
		},
		/*fonction de récupération du nombre de pattes à afficher dans le select*/
		recupTitle: function(data){
			var title;
			for(var value in data){
				if(data[value].tag== "200")
           title = data[value].subfield; 		   
         }
          return title;
			}
			
		}
  }]);
