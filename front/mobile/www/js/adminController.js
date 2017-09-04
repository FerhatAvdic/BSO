(function () {
    'use strict';

    var bsoApp = angular.module("bsoApp");

    bsoApp.controller("adminController", ['$scope','$http','authService','$location','dataService','$localStorage','$stateParams',
 function ($scope, $http, authService, $location, dataService, $localStorage, $stateParams) {


      $scope.logout = function(){
          authService.Logout();
          $location.path('/');
      };

      $scope.getGrades = function(){
          dataService.list('activecompetition', function(res){
              if (res.status === 200) {
                  console.log('activecom', res.data);
                  $scope.activeCom = res.data;
                  $scope.getActiveGrades();
                  $scope.getProgress();
              }
             else {
                 console.log("ERROR: ", res);
             }
             });
         };
          $scope.getGrades();

          $scope.getActiveGrades = function(){
              dataService.readByQuery('activegrades', {competitionId: $scope.activeCom._id}, function(res){
                 if(res.status===200){
                     console.log('activegrades',res.data);
                     $scope.grades = res.data;
                 }
                 else {
                      console.log("ERROR: ", res);
                  }
              });
          };

          $scope.getProgress = function(){
              dataService.readByQuery('projects/graded', {competitionId: $scope.activeCom._id}, function(res){
                 if(res.status===200){
                     console.log('graded',res.data);
                     $scope.progress = res.data;
                 }
                 else {
                      console.log("ERROR: ", res);
                  }
              });
          };

        

    }]);
}());
