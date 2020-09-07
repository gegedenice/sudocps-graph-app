'use strict';

/**
 * @ngdoc overview
 * @name sudocpsApp
 * @description
 * # sudocpsApp
 *
 * Main module of the application.
 */
angular
  .module('sudocpsApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
	  'angular.filter',
    'datatables',
    'dx',
    'ngMap',
    'chart.js'
    //,'ui.materialize'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/unicas', {
        templateUrl: 'views/unicas.html',
        controller: 'UnicasCtrl',
        controllerAs: 'unicas'
      })
      .when('/unicas2', {
        templateUrl: 'views/unicas2.html',
        controller: 'Unicas2Ctrl',
        controllerAs: 'unicas2'
      })
      .when('/record/:ppn', {
        templateUrl: 'views/record.html',
        controller: 'RecordCtrl',
        controllerAs: 'record'
      })
      .when('/presselocale', {
        templateUrl: 'views/presselocale.html',
        controller: 'PresselocaleCtrl',
        controllerAs: 'presselocale'
      })
      .when('/graphevis', {
        templateUrl: 'views/graphevis.html',
        controller: 'GraphevisCtrl',
        controllerAs: 'graphevis'
      })
      .when('/documentation', {
        templateUrl: 'views/documentation.html',
        controller: 'DocumentationCtrl',
        controllerAs: 'documentation'
      })
      .when('/graphepopoto', {
        templateUrl: 'views/graphepopoto.html',
        controller: 'GraphepopotoCtrl',
        controllerAs: 'graphepopoto'
      })
      .when('/exports', {
        templateUrl: 'views/exports.html',
        controller: 'ExportsCtrl',
        controllerAs: 'exports'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .config(['$sceDelegateProvider', function ($sceDelegateProvider) {
	  var urlWhitelist = $sceDelegateProvider.resourceUrlWhitelist();
	  urlWhitelist.push('https://periscope.sudoc.fr**','https://www.sudoc.fr**','http://www.sudoc.fr**','http://presselocaleancienne.bnf.fr**','http://www.idref.fr**','http://localhost:3000');
	  $sceDelegateProvider.resourceUrlWhitelist(urlWhitelist);
	}]);
function initDT(DTDefaultOptions) {
    DTDefaultOptions.setLoadingTemplate('<img src="/angular-datatables/images/loading.gif" />');
}