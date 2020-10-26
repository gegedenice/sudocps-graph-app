'use strict';

/**
 * @ngdoc function
 * @name sudocpsApp.controller:UnicasCtrl
 * @description
 * # UnicasCtrl
 * Controller of the sudocpsApp
 */
angular.module('sudocpsApp')
  .controller('UnicasCtrl', ['$scope','$http', '$filter', 'NgMap', '$q', 'DTOptionsBuilder', 'DTColumnBuilder', 'DTColumnDefBuilder',function ($scope,$http,$filter,NgMap,$q, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder) {
	$scope.dynMarkers = [];$scope.dynMarkers2 = [];
  $scope.loading = true;
  $http.get("./api/unicas") 
  .then(function(response) {
	 $scope.loading = false;
    $scope.datas = response.data.unicas;
    console.log(response.data)
   /*directive datatable
   $scope.dtOptions = DTOptionsBuilder
       .fromFnPromise(function() {
          var defer = $q.defer();
          $http.get('http://localhost:3000/api/unicas').then(function(result) {
            defer.resolve(response.data.unicas);
          });
          return defer.promise;
        })    
        .withOption('lengthMenu', [[10, 50, 100,-1], [10, 50, 100,'All']]);
                  
      $scope.dtColumns = [       
         DTColumnBuilder.newColumn(null).withTitle('#').renderWith(function(data, type, full, meta) {
            return meta.row + 1
         }),  
         DTColumnBuilder.newColumn('record.ppn').withTitle('ppn'),
         DTColumnBuilder.newColumn('record.issn').withTitle('issn')
      ]    */
 
    //bar chart
    //$scope.series = [];
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
  //console.log($scope.keys);
  //console.log($scope.values);
	/*marker & cluster on map
   NgMap.getMap().then(function(map) {
      for (var i=0; i<$scope.datas.length; i++) {
        var latLng = new google.maps.LatLng($scope.datas[i].bib.latitude, $scope.datas[i].bib.longitude);
        $scope.dynMarkers.push(new google.maps.Marker({position:latLng,bib: $scope.datas[i].bib.shortname}));
      }
     $scope.markerClusterer = new MarkerClusterer(map, $scope.dynMarkers, {imagePath: 'https://cdn.rawgit.com/googlemaps/js-marker-clusterer/gh-pages/images/m'});
  $scope.searchFilter = function() {
  $scope.newmarkers2 = [];
  for (i = 0; i < $scope.dynMarkers.length; i++) {
    $scope.marker2 = $scope.dynMarkers[i];
	console.log($scope.marker2.label);
    if ($scope.marker2.label.indexOf($scope.search) > -1 || $scope.marker2.bib.indexOf($scope.search) > -1 || $scope.search == "0") {
      $scope.marker2.setVisible(true);
      $scope.newmarkers2.push($scope.marker2);
    }
    else {
      $scope.marker2.setVisible(false);
    }
  }
  $scope.markerClusterer.clearMarkers();
  $scope.markerClusterer.addMarkers($scope.newmarkers2);
                
            }
	 $scope.filterMarkers = function() {
  $scope.newmarkers1 = [];
  for (i = 0; i < $scope.dynMarkers.length; i++) {
    $scope.marker1 = $scope.dynMarkers[i];
    if ($scope.marker1.bib.indexOf($scope.bibRadio) > -1 || $scope.bibRadio.length == "0") {
      $scope.marker1.setVisible(true);
      $scope.newmarkers1.push($scope.marker1);
    }
    else {
      $scope.marker1.setVisible(false);
    }
  }
  $scope.markerClusterer.clearMarkers();
  $scope.markerClusterer.addMarkers($scope.newmarkers1);
}
    });*/
  });
   }]);
