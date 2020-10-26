'use strict';

/**
 * @ngdoc function
 * @name sudocpsApp.controller:PresselocaleCtrl
 * @description
 * # PresselocaleCtrl
 * Controller of the sudocpsApp
 */
angular.module('sudocpsApp')
  .controller('PresselocaleCtrl', ['$scope','$http', '$filter', function ($scope,$http,$filter) {
    $scope.loading = true;
    $scope.tempBib = []
    $http.get("./api/presselocale") 
    .then(function(response) {
     $scope.loading = false;
      $scope.datas = response.data.presselocale;
      console.log($scope.datas)
     var temp = $filter('countBy')($scope.datas.filter(function(data){
        return data.sudoc_locs != undefined
      })
      .map(function(item){
        return item.sudoc_locs
      })
      .flat(), "name")
      //facette
      $scope.bibsFacet = Object.keys(temp).map(key => ({ "name": key, "value": temp[key] })).sort((first, second) => (first.value > second.value) ? -1 : (first.value < second.value) ? 1 : 0 );
     // console.log($scope.bibsFacet)
      //barchart
      $scope.keys = [];
      $scope.values = [];
      $scope.Bardata = Object.keys(temp).map(key => ({ key: key, value: temp[key] })).sort((first, second) => (first.value < second.value) ? -1 : (first.value > second.value) ? 1 : 0 );
      angular.forEach(temp, function(value, key) {
        $scope.keys.push(key);
        $scope.values.push(value);
      });
    });
  }]);
