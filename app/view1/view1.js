'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope', '$http', function($scope, $http) {
        var api_url = {
            boards: "https://api.trello.com/1/boards/55802d1c66c99fb65297d524?key=b62ae66df753b631c7a8858bc66eae8e"
        }
        $http.get(api_url.boards).
        success(function(data, status, headers, config) {
            // this callback will be called asynchronously
            // when the response is available
            $scope.boards = data;
            console.log( data);
        }).
        error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            $scope.boards = [];
        });

}]);