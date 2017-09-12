(function () {
    'use strict';

    var bsoApp = angular.module("bsoAdmin");

    bsoApp.controller("projectsController", ['$rootScope','$scope','$http','$location','authService','dataService','$window','Upload',
    function ($rootScope, $scope, $http,$location,authService,dataService, $window, Upload) {


    $scope.selectedCat={
        _id: null,
        detailsEn:{
        _id:null,
        title:null
        }
    };
      var crud = {
              newActive: false,
              editActive: false,
              listActive: true,
              deleteActive: false,
              object: null,
              apiTarget: null,
              listToActive: function(){
                  crud.listActive = true;
                  crud.newActive  = false;
                  crud.editActive = false;
                  crud.deleteActive= false;
              },
              startNew: function (){
                  crud.newActive  = true;
                  crud.editActive = false;
                  crud.listActive = false;
                  crud.deleteActive= false;
                  $scope.newItem = crud.object;
                  $scope.getActiveCategories();
              },
              cancelNew: function(){
                  crud.listToActive();
                  $scope.newItem = null;
                  crud.listItems();
              },
              startEdit: function (item){
                  crud.newActive  = false;
                  crud.editActive = true;
                  crud.listActive = false;
                  crud.deleteActive= false;
                  $scope.editingItem = angular.copy(item);
                  $scope.getActiveCategories();
              },
              cancelEdit : function (){
                  crud.listToActive();
                  $scope.editingItem = null;
                  crud.listItems();
              },
              startDelete: function(item){
                  crud.newActive  = false;
                  crud.editActive = false;
                  crud.listActive = false;
                  crud.deleteActive= true;
                  $scope.deletingItem = angular.copy(item);
              },
              cancelDelete: function(item){
                  crud.listToActive();
                  $scope.deletingItem = null;
                  crud.listItems();
              },
              listItems: function(){
                  dataService.readByQuery(crud.apiTarget, {competitionId: $scope.selectedCom._id}, function (res) {
                      if (res.status === 200) {
                          $scope.list = res.data
                          console.log("projects",$scope.list);
                      }
                      else {
                          console.log("ERROR: ", res);
                      }
                  });
              },
              createItem: function() {
                $scope.newItem.projectInfo.researchPaper="none";
                $scope.newItem.competitionId = $scope.selectedCom._id;
                    console.log($scope.newItem);
                authService.Register($scope.newItem, function (res) {
                    console.log(res);
                    if (res === true) {
                        crud.cancelNew();
                        crud.listItems();
                        console.log("SUCCESSFULLY REGISTERED!");
                    } else {
                        $scope.loading = false;
                    }
                });
              },
              updateItem: function() {
                  dataService.update(crud.apiTarget, $scope.editingItem._id, $scope.editingItem, function(res) {
                      if (res.status === 200) {
                          crud.cancelEdit();
                          crud.listItems();
                          console.log(res.data);
                      }
                      else {
                          console.log('Error: ' + res.data);
                      }
                  });
              },
              deleteItem: function(id) {
                  dataService.remove(crud.apiTarget, id, function(res) {
                      if (res.status === 200) {
                          crud.listItems();
                          console.log(res.data);
                      }
                      else {
                          console.log('Error: ' + res.data);
                      }
                  });
              }
          };

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

          var newProject = {
              "username":null,
              "password":null,
              "projectInfo":{
                  "title":null,
                  "abstract":null,
                  "researchPaper": "",
                  "categoryId":null,
                  "school":null,
                  "city":null,
                  "year":null,
                  "video":null,
              },
              "members":[],
              "competitionId":null
          };

          $scope.addMember = function(){
            if (crud.newActive){
                var newMember = angular.copy($scope.projectObj.member);
                $scope.newItem.members.push(newMember);
            }
            else if(crud.editActive){
              var newMember = angular.copy($scope.projectObj.member);
              $scope.editingItem.members.push(newMember);
            }
          };
          $scope.removeMember= function(index){
              if (crud.newActive){
                  $scope.newItem.members.splice(index,1);
              }
              else if(crud.editActive){
                $scope.editingItem.members.splice(index,1);
              }
          };

          crud.object = newProject;
          crud.apiTarget = "projects";
          $scope.crud = crud;
          $scope.selectedCom = {
              _id: null
          };

          $scope.getCompetitionsLight = function (){
              dataService.list("competitionslight", function (res) {
                  if (res.status === 200) {
                      $scope.comslight = res.data
                      $scope.selectedCom._id = $scope.comslight[0]._id;
                      $scope.getActiveCategories();
                      crud.listItems();
                      console.log("comslight",$scope.comslight);
                  }
                  else {
                      console.log("ERROR: ", res);
                  }
              });
          };
          $scope.getCompetitionsLight();

          $scope.getActiveCategories = function(){
            dataService.readByQuery("activecategories",{competitionId: $scope.selectedCom._id}, function (res) {
                if (res.status === 200) {
                  $scope.categories = res.data;
                  console.log("categories", $scope.categories);
                }
                else {
                    console.log("ERROR: ", res);
                }
            });
        };

        $scope.up = {};
            $scope.up.submit = function(){ //function to call on form submit
                console.log("file: ", $scope.up.file);
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
                    console.log("resp.data:", resp.data);
                    if(resp.data.error_code === 0){ //validate success
                        //$window.alert('Success ' /*+ resp.config.data.file.name */+ 'uploaded. Response: ');
                        $scope.fileUploaded = true;
                        crud.createItem();
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

            $scope.selectCat = function(id){
                if (id===null) $scope.filterCat = undefined;
                else
                $scope.filterCat={
                        projectInfo: {
                            categoryId:id
                        }
                };
            };

   }]);
}());
