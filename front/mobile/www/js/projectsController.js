(function () {
    'use strict';

    var bsoApp = angular.module("bsoApp");

    bsoApp.controller("projectsController", ['$scope','$http','authService','$location','dataService','$localStorage','$stateParams',
 function ($scope, $http, authService, $location, dataService, $localStorage, $stateParams) {


      $scope.logout = function(){
          authService.Logout();
          $location.path('/');
      };

      $scope.getActive = function(){
          dataService.list('activecompetition', function(res){
              if (res.status === 200) {
                  console.log('activecom', res.data);
                  $scope.activeCom = res.data;
                  $scope.getProjects();
              }
             else {
                 console.log("ERROR: ", res);
             }
             });
         };
          $scope.getActive();

          $scope.getProjects = function(){
              dataService.readByQuery('projects', {competitionId: $scope.activeCom._id}, function(res){
                 if(res.status===200){
                     console.log('projects',res.data);
                     $scope.projects = res.data;
                 }
                 else {
                      console.log("ERROR: ", res);
                  }
              });
          };

          $scope.openProject = function(project){
                $location.path('/admin/projects/'+project._id);
            };

        $scope.getProject = function(){
          if($stateParams.project_id)
              dataService.read('projects',$stateParams.project_id, function(res){
                  if (res.status === 200) {
                    console.log('project', res.data);
                      $scope.viewProject = res.data
                  }
                  else {
                  console.log("ERROR: ", res);
                  }
              });
      };
      $scope.getProject();

      $scope.location = function(path){
          $location.path(path);
      };

    }]);
}());
