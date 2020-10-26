'use strict';

/**
 * @ngdoc function
 * @name sudocpsApp.controller:ExportsCtrl
 * @description
 * # ExportsCtrl
 * Controller of the sudocpsApp
 */
angular.module('sudocpsApp')
  .controller('ExportsCtrl', ['$scope','$http', 'serviceIlntorcrApi', function ($scope,$http,serviceIlntorcrApi) { 
     /* $http.get("http://localhost:3000/proxy/services/iln2rcr/230&format=text/json") 
      .then(function(response) {
        $scope.bibs = response.data.sudoc.query.result;
      });*/
      serviceIlntorcrApi.recupListeRcr("./proxy/services/iln2rcr/230&format=text/json").
      then(function(response){
       var libraries= response.data.sudoc.query.result;
       $scope.bibs= serviceIlntorcrApi.recupBibs(libraries);
      });
      //all unicas
      $scope.unicasExportAll = function(){
        $http.get("./api/unicas") 
        .then(function(response) {
          console.log(response.data.unicas);
          //var data = {"titre":response.data.unicas.notice.titre,"ppn":response.data.unicas.notice.ppn};
          var data = response.data.unicas.map(function (unica) {
            return {"titre":unica.record.titre,
                    "ppn":unica.record.ppn,
                    "issn":unica.record.issn,
                    "309": unica.record.controle,
                    "bibliothèque":unica.loc.name,
                    "état de collection":unica.loc.etat_de_collection,
                    "ark":unica.ark_bnf,
                    "lien presse locale": unica.url_presselocale,
                    "numerisation":unica.numerisation
                    };   
        });
        const fileName = 'UnicasCR';
        const exportType = 'xls';
        exportFromJSON({ data, fileName, exportType })      
      }) 
      }
      //unicas by bib
  $scope.unicasExport = function(rcr){
  $http.get("./api/rcr2unicas/"+rcr) 
  .then(function(response) {
    console.log(response.data.unicas);
    if(response.data.unicas.length != "0") {
    //var data = {"titre":response.data.unicas.notice.titre,"ppn":response.data.unicas.notice.ppn};
    var data = response.data.unicas.map(function (unica) {
      return {"titre":unica.record.titre,
              "ppn":unica.record.ppn,
              "issn":unica.record.issn,
              "309": unica.record.controle,
              "état de collection":unica.loc.etat_de_collection,
              "ark":unica.ark_bnf,
              "lien presse locale": unica.url_presselocale,
              "numerisation":unica.numerisation
              };   
  });
  const fileName = 'Unicas'+rcr;
  const exportType = 'xls';
  exportFromJSON({ data, fileName, exportType })
}
else {
  alert("Pas d'unica pour cette bibliothèque !")
}
}) 
}
//presse locale all
$scope.presseExportAll = function(){
  $http.get("./api/presselocale") 
  .then(function(response) {
    console.log(response.data.presselocale);
    //var data = {"titre":response.data.unicas.notice.titre,"ppn":response.data.unicas.notice.ppn};
    var data = response.data.presselocale.map(function (presselocale) {
      if(presselocale.sudoc_record){
        var ppn = presselocale.sudoc_record.ppn
        var url_sudoc = presselocale.sudoc_record.url_sudoc
        var bibs = presselocale.sudoc_locs.map(function(bib){return bib.name}).join(";")
      }
      if(presselocale.numerisation){
        var nums = presselocale.numerisation.map(function(num){return num.lieu+" : "+num.url;}).join(";")
      }
      return {"département":presselocale.depts_about.map(function(dept){return dept.name}).join(";"),
              "titre":presselocale.record.titre,
              "édition":presselocale.record.edition,
              "ark":presselocale.record.ark,
              "issn":presselocale.record.issn,
              "ppn":ppn,
              "lien Sudoc":url_sudoc,
              "bibliothèque":bibs,
              "numerisation":nums
              };   
  });
  const fileName = 'PresseLocaleAncienneCR';
  const exportType = 'xls';
  exportFromJSON({ data, fileName, exportType })      
}) 
}
//presse locale by bib
$scope.presseExport = function(rcr){
  $http.get("./api/rcr2presselocale/"+ rcr) 
  .then(function(response) {
    console.log(response.data.presselocale);
    //var data = {"titre":response.data.unicas.notice.titre,"ppn":response.data.unicas.notice.ppn};
    if(response.data.presselocale.length != "0") {
    var data = response.data.presselocale.map(function (presselocale) {
      if(presselocale.sudoc_record){
        var ppn = presselocale.sudoc_record.ppn
        var url_sudoc = presselocale.sudoc_record.url_sudoc
        var bibs = presselocale.sudoc_locs.map(function(bib){return bib.name}).join(";")
      }
      if(presselocale.numerisation){
        var nums = presselocale.numerisation.map(function(num){return num.lieu+" : "+num.url;}).join(";")
      }
      return {"département":presselocale.depts_about.map(function(dept){return dept.name}).join(";"),
              "titre":presselocale.record.titre,
              "ark":presselocale.record.ark,
              "issn":presselocale.record.issn,
              "ppn":ppn,
              "lien Sudoc":url_sudoc,
              "bibliothèque":bibs,
              "numerisation":nums
              };   
  });
  const fileName = 'PresseLocaleAncienne'+rcr;
  const exportType = 'xls';
  exportFromJSON({ data, fileName, exportType })  
}
else {
  alert("Pas de titre de presse locale ancienne pour cette bibliothèque !")
}    
}) 
}

$scope.reloadJS = function(){
  angular.element("#widgetScript").reload();
}
  }]);
