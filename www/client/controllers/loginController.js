(function () {
    'use strict';

    var bsoApp = angular.module("bsoApp");

    bsoApp.controller("loginController", ['$rootScope','$scope','$http', '$location','authService', function ($rootScope,$scope, $http,$location,authService) {

      $scope.credentials = {
        username:null,
        password:null,
        competitionId:null
      };
      $scope.login = function() {
          $scope.credentials.competitionId = $rootScope.activeCom._id;
          $scope.loading = true;
          authService.Login($scope.credentials, function (result) {
              //console.log("result",result);
              if (result === true) {
                  $location.path('/dashboard');
                  $rootScope.loggedin = true;
              } else {
                  $scope.error = 'Username or password is incorrect';
                  $scope.loading = false;
              }
          });
      };
    }]);
}());
