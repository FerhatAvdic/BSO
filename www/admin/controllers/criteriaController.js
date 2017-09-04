(function () {
    'use strict';
    var bsoAdmin = angular.module("bsoAdmin");
    bsoAdmin.controller("criteriaController", ['$scope','$http','dataService', function ($scope, $http, dataService) {

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
                console.log("selected in listitems", $scope.selectedCom);
                dataService.readByQuery(crud.apiTarget,{competitionId: $scope.selectedCom._id}, function (res) {
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
        var criteriaObj = {
          "nameBs":null,
          "nameEn":null,
          "max":null,
          "competitionIds":[]
        };
        crud.object = criteriaObj;
        crud.apiTarget = "criteria";
        $scope.crud = crud;
        $scope.selectedCom={
            _id: null,
            detailsEn:{
                _id:null,
                title:null
            }
        };

        $scope.getCompetitionsLight = function (){
            dataService.list("competitionslight", function (res) {
                console.log("Fetching comslight");
                if (res.status === 200) {
                    $scope.comslight = res.data
                    //crud.listItems();
                    console.log("comslight",$scope.comslight);
                }
                else {
                    console.log("ERROR: ", res);
                }
            });
        };
        $scope.getCompetitionsLight();

        $scope.assignCompetition = function(){
            if (crud.newActive){
                if ($scope.newItem.competitionIds.find(x => x === $scope.selectedCom._id) || $scope.selectedCom._id===null) return;
                var newCompetition = angular.copy($scope.selectedCom._id);
                $scope.newItem.competitionIds.push(newCompetition);
            } else if(crud.editActive){
                if ($scope.editingItem.competitionIds.find(x => x === $scope.selectedCom._id) || $scope.selectedCom._id===null) return;
                var newCompetition = angular.copy($scope.selectedCom._id);
                $scope.editingItem.competitionIds.push(newCompetition);
            }
        };
        $scope.removeCompetition= function(index){
            if (crud.newActive) $scope.newItem.competitionIds.splice(index,1);
            if (crud.editActive) $scope.editingItem.competitionIds.splice(index,1);
        };

        $scope.addCriterion = function(){
            var newCriterion = {
                "nameBs":null,
                "nameEn":null,
                "max":null,
                "value":null
            };
            if (crud.newActive){
                $scope.newItem.criteria.push(newCriterion);
            } else if(crud.editActive){
                $scope.editingItem.criteria.push(newCriterion);
            }
        };

        $scope.removeCriterion=function(index){
            if (crud.newActive) {
                $scope.newItem.criteria.splice(index,1);
            }
            if (crud.editActive) {
                $scope.editingItem.criteria.splice(index,1);
            }
        };

        crud.listItems();

        console.log($scope.list);



    }]);
}());
