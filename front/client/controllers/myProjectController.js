(function () {
'use strict';

var bsoApp = angular.module("bsoApp");

bsoApp.controller("myProjectController", ['$rootScope','$scope','$http','$localStorage','dataService', '$window','Upload',
function ($rootScope,$scope, $http,$localStorage,dataService,$window,Upload) {


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
  var myProjectId = $localStorage.currentUser.id;
  var getMyProject = function(){
    dataService.read("projects", myProjectId, function (res) {
        if (res.status === 200) {
            $scope.myProject = res.data;
        }
        else {
            console.log("ERROR: ", res);
        }
    });
  };
  getMyProject();

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
    $scope.getActiveCategories();

    $scope.addMember = function(){
               var newMember = angular.copy($scope.projectObj.member);
               $scope.myProject.members.push(newMember);
         };
   $scope.removeMember= function(index){
         $scope.myProject.members.splice(index,1);
   };

   $scope.updateMyProject = function(){
      dataService.update('projects', $scope.myProject._id, $scope.myProject, function(res) {
                  if (res.status === 200) {
                      console.log(res.data);
                      $scope.updateSuccess = true;
                  }
                  else {
                      console.log('Error: ' + res.data);
                  }
              });
   };

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
                  url: 'http://localhost:8080/api/upload', //webAPI exposed to upload the file
                  data:{file:file} //pass file as data, should be user ng-model
              }).then(function (resp) { //upload function returns a promise
                  if(resp.data.error_code === 0){ //validate success
                      //$window.alert('Success ' /*+ resp.config.data.file.name */+ 'uploaded. Response: ');
                      $scope.fileUploaded = true;
                      $scope.updateMyProject();
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
