(function () {
    'use strict';

    var bsoAdmin = angular.module("bsoAdmin");

    bsoAdmin.controller("navController", ['$rootScope','$scope','$http','$localStorage','$location','authService','dataService', function ($rootScope,$scope, $http,$localStorage,$location,authService,dataService) {



      $scope.logout=function(){
          authService.Logout();
          $location.path('/home');
      };


    }]);
    }());
