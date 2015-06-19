'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.view1',
  'myApp.view2',
  'myApp.board',
  'myApp.version',
  'ngMaterial',
  'LocalStorageModule'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/board'});
}])
.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('altTheme')
        .primaryPalette('light-green') // specify primary color, all
})
.config(['localStorageServiceProvider', function (localStorageServiceProvider) {
    localStorageServiceProvider
        .setPrefix('tr')
        .setNotify(true, true);
}]);

