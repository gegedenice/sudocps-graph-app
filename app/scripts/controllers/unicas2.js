'use strict';

/**
 * @ngdoc function
 * @name sudocpsApp.controller:Unicas2Ctrl
 * @description
 * # Unicas2Ctrl
 * Controller of the sudocpsApp
 */
angular.module('sudocpsApp')
  .controller('Unicas2Ctrl', ['$scope','$http', '$filter', '$q', function ($scope,$http,$filter,$q) {
      var url = "./api/unicas"
     
      function chartData(s){
          var a = s.map(function(d){return {"loc":d.loc.name}})
        var counts = _.countBy(a,'loc');
        var data = _.map(counts, function(value, key){
            return {
                x: key,
                y: value
            };
        });
        return _.sortBy(data, 'y').reverse()
      }
      
      function mapData(s){
          return s.map(function(d){return {"location": [d.loc.latitude,d.loc.longitude],
            "tooltip": {
                "text": d.record.titre
            }
          }})
      }
    var store = new DevExpress.data.CustomStore({
       // key: "OrderNumber",
        load: function(loadOptions) {
            return $http.get(url)  
            .then(function (response) {  
                loadOptions.requireTotalCount = false;  
                return { data: response.data.unicas };  
            }, function (response) {  
                return $q.reject("Data Loading Error");  
            });    
        }
    })
    var chartStore = new DevExpress.data.CustomStore({
        // key: "OrderNumber",
         load: function(loadOptions) {
             return $http.get(url)  
             .then(function (response) {  
                 loadOptions.requireTotalCount = false;  
                 return chartData(response.data.unicas);  
             }, function (response) {  
                 return $q.reject("Data Loading Error");  
             });  
         }
     })
 
     var mapStore = new DevExpress.data.CustomStore({
        // key: "OrderNumber",
         load: function(loadOptions) {
             return $http.get(url)  
             .then(function (response) {  
                 loadOptions.requireTotalCount = false;  
                 return mapData(response.data.unicas);  
             }, function (response) {  
                 return $q.reject("Data Loading Error");  
             });  
         }
     })

    $scope.chartOptions = {
        dataSource:chartStore,
        series: {
            argumentField: "x",
            valueField: "y",
            name: "Nombre d'unicas",
            type: "bar",
            color: '#ffaa66'
        },
        argumentAxis: { 
            label: {
                overlappingBehavior: "rotate",
                rotationAngle: 45
            }
        },
        tooltip: {
            enabled: true,
            customizeTooltip: function (arg) {
                return {
                    text: arg.argumentText + " - " + arg.valueText
                };
            }
        }
    };
    $scope.dataGridOptions = {
        dataSource: store,
        showBorders: true,
        requireTotalCount : false,
        showBorders: true,
        rowAlternationEnabled: true,
        allowColumnReordering: true, 
        columnAutoWidth: false,
        columnFixing: { 
            enabled: true
        },
        "export": {
           enabled: true,
           fileName: "unicas"
         },
        columnChooser: {
         enabled: true,
         mode:"select"
        },
        sorting: {
            mode: "multiple"
        },
        paging: {
            pageSize: 10
        },
        pager: {
            showPageSizeSelector: true,
            allowedPageSizes: [10, 20, 50,100,150],
            showInfo: true
        },
        headerFilter: {
            visible: true
        },
        filterPanel: { visible: true },
        searchPanel: {
            visible: true
        },
        groupPanel: {
            emptyPanelText: "Glisser/déposer ici des en-têtes de colonnes pour effectuer des regroupements",
            visible: true
        },
        columns: [{
            caption: "PPN",
            dataField: "record.ppn",
            dataType: "string"
        }, 
           { caption: "Titre",
            dataField: "record.titre",
            dataType: "string"
        }, {
            caption: "ISSN",
            dataField: "record.issn",
            dataType: "string"
        }, {
            caption: "Bibliothèque",
            dataField: "loc.name",
            dataType: "string"
            //groupIndex: 0
        }, {
            caption: "Bib RCR",
            dataField: "loc.rcr",
            dataType: "string"
            //groupIndex: 0
        },{
            caption: "Etat de collection (source Sudoc)",
            dataField: "loc.etat_de_collection",
            dataType: "string"
        }, {
            caption: "Notice Presse locale ancienne (source BnF)",
            dataField: "url_presselocale",
            cellTemplate: function(container, options) {
                return $("<a>", { "href": options.value, "target": "_blank" }).text(options.value);
              }}, {
            caption: "Numérisation (source BnF)",
            dataField: "numerisation"
        }],
        sortByGroupSummaryInfo: [{
            summaryItem: "count"
        }],
        summary: {
            totalItems: [{
                column: "record.ppn",
                summaryType: "count",
                displayFormat: "{0} unicas"
            }],
            groupItems: [{
                column: "record.ppn",
                summaryType: "count",
                displayFormat: "{0} unicas",
            }]
        }
    };
}]);