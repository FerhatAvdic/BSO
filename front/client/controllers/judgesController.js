(function () {
    'use strict';

    var bsoApp = angular.module("bsoApp");

    bsoApp.controller("judgesController", ['$scope','$http', function ($scope, $http) {


        $scope.setNewJudge = function (){
            $scope.newJudge = {
                email: "a",
                password: "a",
                name: "a",
    		    surname: "a",
                phone: 0,
    		    gender: "a",
            	profession:"a",
            	company:"a"
            }
        };
        $scope.setNewJudge();

        $scope.editingJudge = null;
        $scope.isEditing = false;

        $scope.startEditing = function (judge){
            $scope.isEditing = true;
            $scope.editingJudge = judge;
            console.log($scope.editingJudge);
        }
        $scope.exitEditing = function (){
            $scope.isEditing = false;
            console.log($scope.isEditing);
        }


        // when landing on the page, get all todos and show them
        $scope.getJudges = function (){
        $http.get('/api/judges')
            .then(function(res) {
                $scope.judges = res.data;
                console.log(res);
            },
            function(err) {
                console.log('Error: ' + err.data);
            });
        }

        // when submitting the add form, send the text to the node API
        $scope.createJudge = function() {
            //$scope.collectDates();
            $http.post('/api/judges', $scope.newJudge)
                .then(function(res) {
                    $scope.setNewJudge();
                    $scope.getJudges();
                    console.log(res.data);
                },
                function(err) {
                    console.log('Error: ' + err.data);
                });
        };
        $scope.updateJudge = function() {
            $http.put('/api/judges/' + $scope.editingJudge._id, $scope.editingJudge)
                .then(function(response) {
                    $scope.getJudges();
                    $scope.exitEditing();
                    console.log(response.data);
                },
                function(response) {
                    console.log('Error: ' + response.data);
                });
        };

        // delete a todo after checking it
        $scope.deleteJudge = function(id) {
            $http.delete('/api/judges/' + id)
                .then(function(response) {
                    $scope.getJudges();
                    console.log(response.data);
                },
                function(response) {
                    console.log('Error: ' + response.data);
                });
        };

        $scope.getJudges();
        console.log($scope.judges);

    }]);
    }());
