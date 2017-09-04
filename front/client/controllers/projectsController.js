(function () {
    'use strict';

    var bsoApp = angular.module("bsoApp");

    bsoApp.controller("projectsController", ['$scope','$http', function ($scope, $http) {


        $scope.setNewProject = function (){
            $scope.newProject = {
                email: null,
                password: null,
                members: [{
                    name: null,
    		        surname: null,
    		        email: null,
    		        dateOfBirth: null,
    		        grade: null,
    		        gender: null
                },
                {
                    name: null,
                    surname: null,
                    email: null,
                    dateOfBirth: null,
                    grade: null,
                    gender: null
                }],
                supervisor: {
                    name: null,
                	surname: null,
                	email: null,
                	phone: null,
                	gender: null
                },
                school: {
                    name: null,
            		city: null,
            		address: null
                },
                projectInfo: {
                    title: null,
                    category: null,
                    abstract: null,
                    researchPaper: null
                }
            };
        }
        $scope.setNewProject();
        $scope.editingProject = null;
        $scope.contestantBD = [];
        for (var i=0; i<2; i++){
            $scope.contestantBD.push({
                day: null,
                month: null,
                year: null
            });
        }
        $scope.collectDates = function(){
            $scope.newProject.members[0].dateOfBirth = $scope.contestantBD[0].day + "-" + $scope.contestantBD[0].month + "-" + $scope.contestantBD[0].year;
            $scope.newProject.members[1].dateOfBirth = $scope.contestantBD[1].day + "-" + $scope.contestantBD[1].month + "-" + $scope.contestantBD[1].year;
        }
        $scope.isEditing = false;
        $scope.days = [];
        for (var i = 1; i<=31; i++)
            $scope.days.push({day: i});
        $scope.years = [];
        for (var i = 1995; i<=2015; i++)
            $scope.years.push({year: i});
        $scope.months = [
            {month: 'January'},
            {month: 'February'},
            {month: 'March'},
            {month: 'April'},
            {month: 'May'},
            {month: 'June'},
            {month: 'July'},
            {month: 'August'},
            {month: 'September'},
            {month: 'October'},
            {month: 'November'},
            {month: 'December'}];

        $scope.startEditing = function (project){
            $scope.isEditing = true;
            $scope.editingProject = project;
            console.log($scope.editingProject);
        }
        $scope.exitEditing = function (){
            $scope.isEditing = false;
            console.log($scope.isEditing);
        }


        // when landing on the page, get all todos and show them
        $scope.getProjects = function (){
        $http.get('/api/projects')
            .then(function(res) {
                $scope.projects = res.data;
                console.log(res);
            },
            function(err) {
                console.log('Error: ' + err.data);
            });
        }

        // when submitting the add form, send the text to the node API
        $scope.createProject = function() {
            //$scope.collectDates();
            $http.post('/api/projects', $scope.newProject)
                .then(function(res) {
                    $scope.setNewProject();
                    //$scope.projects = res.data;
                    $scope.getProjects();
                    console.log(res.data);
                },
                function(err) {
                    console.log('Error: ' + err.data);
                });
        };
        $scope.updateProject = function() {
            $http.put('/api/projects/' + $scope.editingProject._id, $scope.editingProject)
                .then(function(response) {
                    //$scope.projects = response.data;
                    $scope.getProjects();
                    $scope.exitEditing();
                    console.log(response.data);
                },
                function(response) {
                    console.log('Error: ' + response.data);
                });
        };

        // delete a todo after checking it
        $scope.deleteProject = function(id) {
            $http.delete('/api/projects/' + id)
                .then(function(response) {
                    //$scope.projects = response.data;
                    $scope.getProjects();
                    console.log(response.data);
                },
                function(response) {
                    console.log('Error: ' + response.data);
                });
        };

        $scope.getProjects();
        console.log($scope.projects);

    }]);
    }());
