'use strict';

var app = angular.module('cuteApp', ['datatables', 'ngRoute', 'pascalprecht.translate', 'treeControl', 'ngTagsInput', 'ui.bootstrap', 'cuteConfigApp']);
app.config(function($routeProvider, CONFIG) {

     $routeProvider
         .when(
           '/search/:searchContent', {
               templateUrl: 'views/search.html',
               controller: searchcontroller})
         .when(
           '/detail/:type/:id', {
               templateUrl: 'views/detail.html',
               controller: detailcontroller})

         .otherwise(
            {
                redirectTo: '/search'
            });
   });


app.config(function ($translateProvider) {
    $translateProvider.useStaticFilesLoader({
            prefix: '/languages/',
            suffix: '.json'
    });
    $translateProvider.preferredLanguage('zh');
    $translateProvider.useSanitizeValueStrategy('escape');
});


// define a service for the types sync in diff controllers
app.factory('docTypesFactory', function() {
    var service = {};
    var types = [];

    service._setTypes = function(typesIn){
        types = typesIn;
    };
    service._getTypes = function() {
        return types;
    };

    return service;
});


// define a service for the type and id sync in diff controllers
// the diff controller is details controller and navigator controller
app.factory('navDetailFactory', function() {
    var service = {};
    var details = {};

    service._setDetails = function(detailsIn){
        details = detailsIn;
    };
    service._getDetails = function() {
        return details;
    };

    return service;
});


app.controller('appController', function($scope, $location, CONFIG) {
    $scope.internalUse = CONFIG.internalUse;

    $scope.refresh = function(){
        $location.path("search");
        window.location.reload();
    }
});
