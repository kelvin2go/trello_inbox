'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope', '$http', function($scope, $http) {
        var api_keys = "?key=b62ae66df753b631c7a8858bc66eae8e";
        var api_base =  "https://api.trello.com/1/boards/55802d1c66c99fb65297d524";

        var api_url = {
            board: api_base+api_keys,
            cards: api_base+"/cards/"+api_keys,
        }


        var trello =  {
            get_boards: function () {
                $http.get(api_url.board).
                success(function(data, status, headers, config) {
                    $scope.boards = data;
                    console.log( data);
                });
            },
            get_cards: function () {
                $http.get(api_url.cards).
                success(function (data, status, headers, config) {
                    $scope.cards = data;
                    console.log(data);
                });
            }
        };

        trello.get_boards();
        trello.get_cards();
}]);