(function () {
    'use strict';

    var bsoAdmin = angular.module("bsoAdmin");

    bsoAdmin.factory("crudService", ['$scope', 'dataService', function ($scope, dataService) {

      var crud = {
              newActive: false,
              editActive: false,
              listActive: true,
              deleteActive: false,
              object: null,
              apiTarget: null,
              startNew: function (){
                  crud.newActive  = true;
                  crud.editActive = false;
                  crud.listActive = false;
                  crud.deleteActive= false;
                  $scope.newItem = crud.object
              },
              cancelNew: function(){
                  crud.listActive = true;
                  crud.newActive  = false;
                  crud.editActive = false;
                  crud.deleteActive= false;
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
                  crud.listActive = true;
                  crud.newActive  = false;
                  crud.editActive = false;
                  crud.deleteActive= false;
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
                  crud.listActive = true;
                  crud.newActive  = false;
                  crud.editActive = false;
                  crud.deleteActive= false;
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

        return {
            crud: crud
        };
    }]);
}());
