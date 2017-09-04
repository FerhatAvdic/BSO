(function () {
    'use strict';

    var bsoApp = angular.module("bsoApp");

    bsoApp.controller("navController", ['$rootScope','$scope','$http','$localStorage','$location','authService','dataService', function ($rootScope,$scope, $http,$localStorage,$location,authService,dataService) {



      if($localStorage.currentUser) $rootScope.loggedin = true;
      else $rootScope.loggedin = false;

      $scope.logout=function(){
          authService.Logout();
          $location.path('/home');
      };

      $scope.getActive = function(){
                 dataService.list('activecompetition', function(res){
                   if (res.status === 200) {
                       $rootScope.activeCom = res.data;
                       console.log('active', res.data);
                   }
                   else {
                       console.log('Error: ' + res.data);
                   }
                 });
             };
      $scope.getActive();

    }]);
    }());
