(function () {
    'use strict';
    var bsoAdmin = angular.module("bsoAdmin");
    bsoAdmin.controller("competitionsController", ['$scope','$http','dataService', function ($scope, $http, dataService) {

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
                    $scope.newItem = crud.object
                },
                cancelNew: function(){
                    crud.listToActive();
                    $scope.newItem = null;
                },
                startEdit: function (item){
                    crud.newActive  = false;
                    crud.editActive = true;
                    crud.listActive = false;
                    crud.deleteActive= false;
                    $scope.editingItem = angular.copy(item);
                },
                cancelEdit : function (){
                    crud.listToActive();
                    $scope.editingItem = null;
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
                },
                listItems: function(){
                dataService.list(crud.apiTarget, function (res) {
                        if (res.status === 200) {
                            console.log(crud.apiTarget, res.data);
                            $scope.list = res.data
                        }
                        else {
                            console.log("ERROR: ", res);
                        }
                    });
                },
                createItem: function() {
                    dataService.create(crud.apiTarget, $scope.newItem, function(res) {
                        if (res.status === 200) {
                            crud.cancelNew();
                            crud.listItems();
                            console.log(res.data);
                        }
                        else {
                            console.log('Error: ' + res.data);
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
            }
        var competitionObj = {
            "detailsEn": {
                "title": "String",
                "description": "String",
                "logo": "String",
                "about": "String",
                "partners": "String",
                "comittee": "String"
            },
            "detailsBs": {
                "title": "String",
                "description": "String",
                "logo": "String",
                "about": "String",
                "partners": "String",
                "comittee": "String"
            }
        };
        crud.object = competitionObj;
        crud.apiTarget = "competitions";
        $scope.crud = crud;
        $scope.language='nat';

        $scope.setAsActive = function(competition){
          dataService.update('activecompetition', competition._id, competition, function(res){
            if (res.status === 200) {
                crud.listItems();
                console.log('active', res.data);
            }
            else {
                console.log('Error: ' + res.data);
            }
          });
        };

        $scope.getActive = function(){
            dataService.list('activecompetition', function(res){
              if (res.status === 200) {
                  console.log('active', res.data);
              }
              else {
                  console.log('Error: ' + res.data);
              }
            });
        };
        crud.listItems();
        console.log($scope.list);



    }]);
}());
