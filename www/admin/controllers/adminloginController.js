(function () {
    'use strict';

    var bsoApp = angular.module("bsoAdmin");

    bsoApp.controller("adminloginController", ['$scope','$http','$location','authService', function ($scope, $http,$location,authService) {



        $scope.username=null;
        $scope.password=null;
        $scope.login = function() {
            $scope.loading = true;
            authService.Login($scope.username, $scope.password, function (result) {
                console.log("result",result);
                if (result === true) {
                    $location.path('/dashboard/grades');
                } else {
                    $scope.error = 'Username or password is incorrect';
                    $scope.loading = false;
                }
            });
        };
        $scope.logout=function(){
            authService.Logout();
            $location.path('/');
        };


    }]);
    }());
