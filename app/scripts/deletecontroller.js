'use strict';

angular.module('cuteApp').controller('deletecontroller', function ($scope, $http, $q, $location, $timeout, docTypesFactory, CONFIG) {

    $scope.deleteDoc = function() {

        var defered = $q.defer();

        // here the delete controller is details controller child, the $scope.type
        // and $scope.id are defined in the details controller, here use the $scope inherit
        var url = '/api/delete/' + $scope.type + '/' + $scope.id;
        $http({
                url: url,
                method: 'DELETE'
             }).then(function (data) {
                defered.resolve(data);
             }).catch(function (data) {
                defered.reject(data);
             });
        return defered.promise;
    };


    $scope.deleteContent = function() {
       var promise = $scope.deleteDoc();

       promise.then(function(data) {
                $scope.deleteMessages = "delete successfully!";
                // wait for 500 mills to refresh to make sure the server delete the data successfully
                $timeout(function () {
                    $location.path("search");
                    // refresh the whole page after the delete, but it need to enhance partial refresh
                    window.location.reload();
                }, 500);
            }, function(data) {
                $scope.deleteMessages = "can not delete, please contact the admin!";
            });
    };

});

