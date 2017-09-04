(function () {
    'use strict';

    var bsoApp = angular.module("bsoApp");

    bsoApp.controller("registerController", ['$rootScope','$scope','$http', '$location','authService','dataService','$window','Upload',
    function ($rootScope, $scope, $http,$location,authService,dataService,$window,Upload) {

        $scope.projectObj = {
            "member" :{
                    "name": null,
                    "surname": null,
                    "email": null,
                    "phone": null,
                    "gender": null,
                    "type": null
            },
            "memberTypes" : [
                {
                "name": "Member",
                "value":"member"
            },{
                "name": "Mentor",
                "value": "mentor"
            }]
        };

        $scope.newProject = {
            "username":null,
            "password":null,
            "projectInfo":{
                "title":null,
                "abstract":null,
                "researchPaper": "",
                "category":null,
                "school":null,
                "city":null,
                "year":null,
                "video":null,
            },
            "members":[]
        };
        $scope.newProject = {
            "username":"f",
            "password": "123123",
            "projectInfo":{
                "title": "project1",
                "abstract": "desc",
                "researchPaper": "none",
                "categoryId": "Environment",
                "school": "TBK",
                "city": "SA",
                "year": "3",
                "video": null,
            },
            "members":[],
            "competitionId":null
        };

        $scope.addMember = function(){
            var newMember = angular.copy($scope.projectObj.member);
            $scope.newProject.members.push(newMember);
            console.log("members",$scope.newProject.members);
        };
        $scope.removeMember= function(index){
            $scope.newProject.members.splice(index,1)
            console.log("members",$scope.newProject.members);
        };

        $scope.registerProject = function(){
          $scope.newProject.competitionId = $rootScope.activeCom._id;
          console.log("project",$scope.newProject);
          $scope.up.submit();

        };

        $scope.getActiveCategories = function(){
          dataService.readByQuery("activecategories",{competitionId: $rootScope.activeCom._id}, function (res) {
              if (res.status === 200) {
                $scope.categories = res.data;
                console.log("categories", $scope.categories);
              }
              else {
                  console.log("ERROR: ", res);
              }
          });
      };

      $scope.getActiveCompetition = function(){
           dataService.list('activecompetition', function(res){
             if (res.status === 200) {
                 $rootScope.activeCom = res.data;
                 $scope.getActiveCategories();
                 console.log('active', res.data);
             }
             else {
                 console.log('Error: ' + res.data);
             }
           });
       };
       $scope.getActiveCompetition();

       $scope.up = {};
           $scope.up.submit = function(){ //function to call on form submit
               console.log( $scope.up.file);
               if ($scope.up.upload_form.file.$valid && $scope.up.file) { //check if from is valid
                   $scope.up.upload($scope.up.file); //call upload function
               }else{
                   $scope.fileUploaded = false;
               }
           }
           $scope.up.upload = function (file) {
               Upload.upload({
                   //url: 'http://localhost:8080/api/upload', //webAPI exposed to upload the file
                   url: '/api/upload', //webAPI exposed to upload the file
                   data:{file:file} //pass file as data, should be user ng-model
               }).then(function (resp) { //upload function returns a promise
                   if(resp.data.error_code === 0){ //validate success
                       //$window.alert('Success ' /*+ resp.config.data.file.name */+ 'uploaded. Response: ');
                       $scope.fileUploaded = true;
                       authService.Register($scope.newProject, function (res) {
                           if (res===true) {
                               $location.path('/login');
                               console.log("SUCCESSFULLY REGISTERED!");
                           } else {
                               $scope.loading = false;
                               console.log("ERROR");
                           }
                       });
                   } else {
                       $window.alert('an error occured');
                   }
               }, function (resp) { //catch error
                   console.log('Error status: ' + resp.status);
                   $window.alert('Error status: ' + resp.status);
               }, function (evt) {
                   console.log(evt);
                   var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                   console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                   $scope.up.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
               });
           };

    }]);
}());
