'use strict';

angular.module('myApp.board', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/board', {
    templateUrl: 'board/board.html',
    controller: 'BoardCtrl'
  });
}])

.controller('BoardCtrl', ['$scope', '$http', '$timeout', function($scope, $http, $timeout) {
        var api_token = "b62ae66df753b631c7a8858bc66eae8e";
        var api_base =  "https://api.trello.com/1/";
        $scope.board_cur = "55802d1c66c99fb65297d524";

        var api_url = {
            board: api_base+"boards/"+$scope.board_cur,
            board_cards: api_base+"boards/"+$scope.board_cur+"/cards/",
            cards: api_base+"cards/"
        }

        $scope.avatar_src = function( avatarHash ){
            return "https://trello-avatars.s3.amazonaws.com/"+avatarHash+"/170.png";
        }
        $scope.isLoggedIn = false,
        $scope.startLoad = false,
        $scope.board = [],
        $scope.cards = [];

        var appTrello =  {
            get_user_token: function(){
                $scope.startLoad = true;
                Trello.authorize({
                    type: "popup",
                    success: onAuthorize
                });
            },
            get_boards : function() {
                $http.get(api_url.board, {params: {key: api_token}}).
                    success(function (data, status, headers, config) {
                        $scope.board = data;
                        //console.log(data);
                    });
            },
            get_cards: function() {
                Trello.get("members/me/cards", {actions: "commentCard,action_memberCreator_fields"}, function(cards) {
                    //console.log(cards);
                    $scope.cards = [];
                    cards.forEach ( function( item ) {
                        if (typeof item.badges != 'undefined' && typeof item.badges.comments != 'undefined' && item.badges.comments > 0) {
                            console.log( item );
                            var newCard = item;
                            newCard.commentCard = [];
                            item.actions.forEach( function( action ){
                                console.log(action.data.text.indexOf("@"+$scope.myprofile.username));
                                if ( action.type == 'commentCard' && action.data.text.indexOf("@"+$scope.myprofile.username) > -1 ){
                                    newCard.commentCard.push( action );
                                }
                            });
                            console.log(newCard.commentCard);
                            if ( newCard.commentCard.length > 0){
                                $scope.cards.push( newCard );
                            }
                        }
                    });
                    $timeout(function () {
                        $scope.startLoad = false;
                    }, 1000);
                    $scope.$apply();
                    //console.log( $scope.cards )
                });
            }
        };

        function onAuthorize(){
            Trello.members.get("me", function(member){
                console.log( member );
                $scope.myprofile = member;
                appTrello.get_cards();
            });
            $scope.isLoggedIn = Trello.authorized();
        }

        //init Action
        $scope.trello_connect = appTrello.get_user_token;
        $scope.isLoggedIn = Trello.authorized();
        if ( $scope.isLoggedIn ){
            onAuthorize();
        }

}]);