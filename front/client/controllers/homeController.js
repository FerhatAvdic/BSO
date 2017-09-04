(function () {
    'use strict';

    var bsoApp = angular.module("bsoApp");

    bsoApp.controller("homeController", ['$rootScope','$scope','$http','$localStorage','dataService', function ($rootScope, $scope, $http,$localStorage,dataService) {

      if($localStorage.currentUser){
          console.log($localStorage.currentUser);
            $scope.currentUser=$localStorage.currentUser;
      }

      $scope.getActive = function(){
                 dataService.list('activecompetition', function(res){
                   if (res.status === 200) {
                       $rootScope.activeCom = res.data;
                       console.log('competition', res.data);
                       $scope.getCategories();
                   }
                   else {
                       console.log('Error: ' + res.data);
                   }
                 });
             };
      $scope.getActive();

      $scope.getCategories= function(){
                 dataService.readByQuery('activecategories',{competitionId: $rootScope.activeCom._id}, function(res){
                   if (res.status === 200) {
                       $scope.categories = res.data;
                       console.log('categories', res.data);
                   }
                   else {
                       console.log('Error: ' + res.data);
                   }
                 });
             };



    }]);
    }());
