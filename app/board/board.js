'use strict';

angular.module('myApp.board', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/board', {
    templateUrl: 'board/board.html',
    controller: 'BoardCtrl'
  });
}])

.controller('BoardCtrl', ['$scope', '$http', function($scope, $http) {
        var api_token = "b62ae66df753b631c7a8858bc66eae8e";
        var api_base =  "https://api.trello.com/1/";
        $scope.board_cur = "55802d1c66c99fb65297d524";

        var api_url = {
            board: api_base+"boards/"+$scope.board_cur,
            board_cards: api_base+"boards/"+$scope.board_cur+"/cards/",
            cards: api_base+"cards/"
        }

        $http.get(api_url.board, {params:{key: api_token}}).
        success(function(data, status, headers, config) {
            $scope.board = data;
            console.log( data);
        });

        $http.get(api_url.board_cards, {params:{key: api_token}}).
        success(function(data, status, headers, config) {
            $scope.cards = data;
            console.log( data);
            get_cards(data);
        });

        var get_cards = function ( cards ){
            $scope.cards_detail = [];
            cards.forEach ( function( item ){
                if (typeof item.badges != 'undefined' && typeof item.badges.comments != 'undefined' && item.badges.comments > 0 ) {
                    $http.get(api_url.cards+item.id, {params:{key: api_token, actions: "commentCard" }}).
                    success(function(data, status, headers, config) {
                        $scope.cards_detail.push( data);
                            console.log(data);
                    });
                }
            });
        };

}]);