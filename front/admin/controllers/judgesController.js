(function () {
    'use strict';
    var bsoAdmin = angular.module("bsoAdmin");
    bsoAdmin.controller("judgesController", ['$scope','$http','dataService', function ($scope, $http, dataService) {

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
                            $scope.list.forEach(function(judge){
                                judge.selected=false;
                            });
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
            };
            var judgeObj = {
                "name": null,
                "surname":null,
                "email":null,
                "phone":null
            };
            crud.object = judgeObj;
            crud.apiTarget = "judges";
            $scope.crud = crud;
            crud.listItems();
            $scope.all={
                selected : false
            };
            var allSelected = false;

            $scope.toggleAllJudges = function(){
                if(!allSelected)
                {
                    $scope.list.forEach(function(judge){
                        judge.selected = true;
                    });
                    allSelected=true;
                }
                else{
                    $scope.list.forEach(function(judge){
                        judge.selected = false;
                    });
                    allSelected=false;
                }
            };

            $scope.distributeTokens = function(){
                var selectedJudges = [];
                $scope.list.forEach(function(judge){
                    if(judge.selected) selectedJudges.push(judge._id);
                });
                if (!selectedJudges.length<1)
                dataService.create('judges/tokens', selectedJudges, function(res) {
                    if (res.status === 200) {
                        console.log(res.data);
                        allSelected=false;
                        $scope.all.selected=false;
                        crud.listItems();
                    }
                    else {
                        console.log('Error: ' + res.data);
                    }
                });
            };

            $scope.selectedCom = {
                     _id: null
                 };

                 $scope.getCompetitionsLight = function (){
                     dataService.list("competitionslight", function (res) {
                         if (res.status === 200) {
                             $scope.comslight = res.data
                             $scope.selectedCom._id = $scope.comslight[0]._id;
                             $scope.getActiveCategories();
                             console.log("comslight",$scope.comslight);
                         }
                         else {
                             console.log("ERROR: ", res);
                         }
                     });
                 };


                 $scope.getActiveCategories = function(){
                   dataService.readByQuery("activecategories",{competitionId: $scope.selectedCom._id}, function (res) {
                       if (res.status === 200) {
                         $scope.categories = res.data;
                         console.log("activecategories", res.data);
                         dataService.list(crud.apiTarget, function (res) {
                                 if (res.status === 200) {
                                     $scope.list = res.data
                                     $scope.list.forEach(function(judge){
                                         judge.newCategories=[];
                                         $scope.categories.forEach(function(category){
                                             //find function
                                             function byIds(element, index, array){
                                                 return element.categoryId === category._id && element.competitionId === $scope.selectedCom._id;
                                             };
                                            if (judge.categories.find(byIds)){
                                                judge.newCategories.push({
                                                    "categoryId":category._id,
                                                    "nameEn": category.detailsEn.name,
                                                    "checked":true
                                                });
                                            }else{
                                                judge.newCategories.push({
                                                    "categoryId":category._id,
                                                    "nameEn": category.detailsEn.name,
                                                    "checked":false
                                                });
                                            }
                                        });

                                     });
                                     console.log("judges and categories", $scope.list);
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



        $scope.startCategories = function(){
            crud.listActive = false;
            crud.newActive  = false;
            crud.editActive = false;
            crud.deleteActive= false;
            $scope.assignCategoriesActive = true;
             $scope.getCompetitionsLight();
        };
        $scope.cancelCategories = function(){
            crud.listToActive();
            $scope.assignCategoriesActive = false;
        };

        $scope.assignCategories = function(){
            var judges=[];
            console.log("list",$scope.list);
            $scope.list.forEach(function(judge){
                console.log("judge newCategories",judge.newCategories);
                var categories = [];
                var doAdd = false;
                judge.newCategories.forEach(function(category){
                    if(category.checked===true){
                        categories.push({
                            "categoryId":category.categoryId,
                            "competitionId":$scope.selectedCom._id
                        });
                        doAdd = true;
                    }
                });
                if (doAdd===true){
                  judges.push({
                      "_id": judge._id,
                      "categories": categories
                  });
                }
            });
            console.log("sneding judges",judges);
            dataService.create('judges/categories', judges, function(res) {
                if (res.status === 200) {
                    console.log(res.data);
                    $scope.cancelCategories();
                    crud.listItems();
                }
                else {
                    console.log('Error: ' + res.data);
                }
            });


        };

    }]);
}());
