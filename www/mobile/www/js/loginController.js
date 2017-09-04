(function () {
    'use strict';

    var bsoApp = angular.module("bsoApp");

    bsoApp.controller("loginController", ['$rootScope','$scope','$http','$location','authService', function ($rootScope, $scope, $http, $location, authService) {

        $scope.credentials = {
          "admin": {
            "username":null,
            "password":null
          },
          "judge":{
            "code":null
          }
        };
        $scope.judgeLogin = function(){
          authService.Login($scope.credentials.judge, function (result) {
              console.log("result",result);
              if (result === true) {

                  $location.path('/judge/guide');
                  $rootScope.loggedin = true;
              } else {
                  $scope.error = 'Code is incorrect';
                  $scope.loading = false;
              }
          });
        };
        $scope.adminLogin = function(){
          authService.Login($scope.credentials.admin, function (result) {
              console.log("result",result);
              if (result === true) {

                  $location.path('/admin/panel');
                  $rootScope.loggedin = true;
              } else {
                  $scope.error = 'Code is incorrect';
                  $scope.loading = false;
              }
          });
        };


    }]);
    }());
