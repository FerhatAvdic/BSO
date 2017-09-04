(function () {
    'use strict';

    var bsoApp = angular.module("bsoApp");

    bsoApp.controller("judgeController", ['$scope','$http','authService','$location','dataService','$localStorage','$stateParams',
     function ($scope, $http, authService, $location, dataService, $localStorage, $stateParams) {

        $scope.list=[];
        for(var i=0; i<20; i++)
        $scope.list.push('project '+(i+1));

        $scope.logout = function(){
            authService.Logout();
            $location.path('/');
        };

        $scope.getJudge = function(){

          dataService.read('judgepersonal',$localStorage.currentUser.judge.id, function(res){
              if (res.status === 200) {
                console.log('judge', res.data);
                    $scope.judge = res.data
                    $scope.getAssignedProjects();
                }
                else {
                console.log("ERROR: ", res);
                }
          });
        };
        $scope.getJudge();

        $scope.getAssignedProjects = function(){
            var parameters = {
                categoryIds:[],
                competitionId: null
            };
            $scope.judge.categories.forEach(function(category){
                parameters.categoryIds.push(category.categoryId);
            });
            parameters.competitionId = $scope.judge.categories[0].competitionId;
           dataService.readByQuery('projects/judge',parameters, function(res){
              if (res.status === 200) {
                console.log('projects', res.data);
                  $scope.projects = res.data
              }
              else {
              console.log("ERROR: ", res);
              }
          });
        };

        $scope.openProjectEvaluation = function(project){
          $location.path('/judge/panel/'+project._id);
        };

        $scope.location = function(path){
            $location.path(path);
        };

        $scope.getProject = function(){
            if($stateParams.project_id)
                dataService.read('projects/judge',$stateParams.project_id, function(res){
                    if (res.status === 200) {
                      console.log('project', res.data);
                        $scope.evaluatingProject = res.data

                        $scope.getCriteria();
                    }
                    else {
                    console.log("ERROR: ", res);
                    }
                });
        };
        $scope.getProject();
        $scope.getCriteria = function(){
            dataService.list('activecompetition', function(res){
                if (res.status === 200) {
                  console.log('activecom', res.data);
                    $scope.activeCom = res.data
                    var query ={
                        competitionId: $scope.activeCom._id,
                        categoryId: $scope.evaluatingProject.projectInfo.categoryId,
                        projectId: $scope.evaluatingProject._id,
                        judgeId: $scope.judge._id,
                    };
                    dataService.readByQuery('gradesbyquery',query, function(res){
                        if (res.status === 200) {
                          console.log('grades', res.data);
                            $scope.grade = res.data;
                            if (!$scope.grade){
                                dataService.readByQuery('activecriteria',{competitionId: $scope.activeCom._id}, function(res){
                                    if (res.status === 200) {
                                      console.log('criteria', res.data);
                                        $scope.criteria = res.data
                                    }
                                    else {
                                    console.log("ERROR: ", res);
                                    }
                                });
                            }
                            else{
                                $scope.criteria=$scope.grade.evaluation;
                            }
                        }
                        else {
                        console.log("ERROR: ", res);
                        }
                    });
                }
                else {
                console.log("ERROR: ", res);
                }
            });
        };

        $scope.submitEvaluation = function(){

            var grade = {
                competitionId: $scope.activeCom._id,
                categoryId: $scope.evaluatingProject.projectInfo.categoryId,
                projectId: $scope.evaluatingProject._id,
                judgeId: $scope.judge._id,
                evaluation: []
            };
            var total=0;
            var totalMax=0;
            $scope.criteria.forEach(function(c){
                total+=c.value;
                totalMax+=c.max;
                grade.evaluation.push({
                    nameBs: c.nameBs,
                    nameEn: c.nameEn,
                    max: c.max,
                    value: c.value
                });
            });
            grade.evaluation.push({
                nameBs: 'Ukupno',
                nameEn: 'Total',
                max: totalMax,
                value: total
            });
            dataService.create('grades',grade, function(res){
                if (res.status === 200) {
                  console.log(res.data);
                }
                else {
                console.log("ERROR: ", res);
                }
            });
        };

    }]);
}());
