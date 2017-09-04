(function () {
    'use strict';

    var bsoApp = angular.module("bsoAdmin");

    bsoApp.controller("dashboardController", ['$rootScope','$scope','$http','$location','authService','dataService', function ($rootScope, $scope, $http,$location,authService,dataService) {

        $scope.logout=function(){
            authService.Logout();
            $location.path('/');
        };
        $scope.selectedCom={
            _id: null,
            detailsEn:{
                _id:null,
                title:null
            }
        };
        $scope.selectedCat={
            _id: null,
            detailsEn:{
                _id:null,
                title:null
            }
        };
        $scope.gradeFilter ={
            nameEn: "Total"
        };
        $scope.getCompetitionsLight = function (){
            dataService.list("competitionslight", function (res) {
                if (res.status === 200) {
                    $scope.comslight = res.data
                    $scope.selectedCom._id = $scope.comslight[0]._id;
                    console.log("selectedCom",$scope.selectedCom);
                    console.log("comslight",$scope.comslight);

                    $scope.getGrades();
                }
                else {
                    console.log("ERROR: ", res);
                }
            });
        };
        $scope.getCompetitionsLight();
        $scope.logMe = function(item){
            console.log("changed", item);
        }

        $scope.getGrades = function(){
            $scope.getActiveGrades();
            $scope.getProgress();
            $scope.getCategories();
            $scope.getCriteria();
        };

            $scope.getActiveGrades = function(){
                dataService.readByQuery('activegrades', {competitionId: $scope.selectedCom._id}, function(res){
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
                dataService.readByQuery('projects/graded', {competitionId: $scope.selectedCom._id}, function(res){
                   if(res.status===200){
                       console.log('graded',res.data);
                       $scope.progress = res.data;
                   }
                   else {
                        console.log("ERROR: ", res);
                    }
                });
            };

            $scope.getCategories = function(){
                dataService.readByQuery('categories',{competitionId: $scope.selectedCom._id}, function (res) {
                    if (res.status === 200) {
                        console.log('categories', res.data);
                        $scope.categories = res.data
                    }
                    else {
                        console.log("ERROR: ", res);
                    }
                });
            };

            $scope.getCriteria = function(){
                dataService.readByQuery('criteria',{competitionId: $scope.selectedCom._id}, function (res) {
                    if (res.status === 200) {
                        console.log('criteria', res.data);
                        $scope.criteria = res.data
                    }
                    else {
                        console.log("ERROR: ", res);
                    }
                });
            };

            $scope.selectCat = function(id){
                if (id===null) $scope.filterCat = undefined;
                else
                $scope.filterCat={
                    project: {
                        projectInfo: {
                            categoryId:id
                        }
                    }
                };

            };


    }]);
}());
