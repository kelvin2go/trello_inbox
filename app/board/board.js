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
        $scope.boardIds = [],
        $scope.boards = [];
        $scope.listIds = [],
        $scope.lists = [];
        $scope.cards = [];

        var appTrello =  {
            get_user_token: function(){
                $scope.startLoad = true;
                Trello.authorize({
                    type: "popup",
                    scope: { read: true, write: true },
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
                    console.log("cards");
                    //console.log(cards);
                    $scope.cards = [];
                    cards.forEach ( function( item ) {
                        if (typeof item.badges != 'undefined' && typeof item.badges.comments != 'undefined' && item.badges.comments > 0) {
                            //console.log( item );
                            var newCard = item;
                            newCard.commentCard = [];
                            item.actions.forEach( function( action ){
                                if ( action.type == 'commentCard' && action.data.text.indexOf("@"+$scope.myprofile.username) > -1 ){
                                    action.read = false;
                                    newCard.commentCard.push( action );

                                    var tList = [];
                                    if ( $scope.boardIds.indexOf( action.data.board.id ) === -1 ){ //NEW board
                                        $scope.boardIds.push( action.data.board.id );
                                        tList.push( action.data.list);
                                        $scope.listIds.push( action.data.list.id );
                                        $scope.boards.push( {id:action.data.board.id , board: action.data.board, lists:tList} )
                                    }
                                    if ( $scope.listIds.indexOf( action.data.list.id ) === -1 ){ //NEW list
                                        $scope.listIds.push( action.data.list.id );

                                        for (var i = 0; i < $scope.boards.length; i++) {
                                            if ( $scope.boards[i]['id'] == action.data.board.id ){
                                                $scope.boards[i]['lists'].push( action.data.list)
                                            }
                                        }
                                    }


                                }
                            });
                            //console.log(newCard.commentCard);
                            if ( newCard.commentCard.length > 0){
                                $scope.cards.push( newCard );
                            }

                        }
                    });

                    $timeout(function () {
                        $scope.startLoad = false;
                    }, 800);
                    $scope.$apply();
                    console.log("BOARD");
                    console.log($scope.boards);
                    console.log("cards");
                    console.log( $scope.cards );
                });
            },
            post_comment: function( cardId , commentText ){
                Trello.post("cards/"+cardId+"/actions/comments", {text: commentText}, function( result ){
                    //console.log(result);
                });
            },
            get_mentioned_cards : function () {
                Trello.get("/members/me/notifications", {filter:"mentionedOnCard",board_fields:"all",list_fields:"all"}, function(cards){
                    console.log(" notify ");
                    console.log(cards);
                    $scope.cards = cards;
                    $timeout(function () {
                        $scope.startLoad = false;
                    }, 800);
                    $scope.$apply();
                });
            },
        };

        function onAuthorize(){
            Trello.members.get("me", function(member){
                console.log( member );
                $scope.myprofile = member;
                appTrello.get_cards();
                //appTrello.get_mentioned_cards();
            });
            $scope.isLoggedIn = Trello.authorized();
        }

        //init Action
        $scope.trello_connect = appTrello.get_user_token;
        $scope.isLoggedIn = Trello.authorized();
        if ( $scope.isLoggedIn ){
            onAuthorize();
        }
        $scope.reply = appTrello.post_comment;
        $scope.timeNow = new Date();
}]);