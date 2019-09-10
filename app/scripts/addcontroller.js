'use strict';

angular.module('cuteApp').controller('addcontroller', function ($scope, $http, $q, $location, $timeout, docTypesFactory, CONFIG) {

    $scope.addFailed = false;
    $scope.addFailedMessages = "";
    $scope.addSuccessfully = false;
    $scope.addSuccessfullyMessages = "";
    $scope.addContentResponse = false;
    $scope.addContent = {};

    $scope.isCreateContentTypeEmpty = false;

    $scope.tags = [];

    $scope.addLevels = CONFIG.levels;
    $scope.addPublic = CONFIG.public;


    // init items for reasons and steps
    $scope.items = [];


    $scope.addItem = function() {
      var newItem = {"reason": "", "steps": [{key: 0, value: ""}]};
      $scope.items.push(newItem);
    };


    $scope.removeItem = function($index) {
      $scope.items.splice($index, 1);
    };


    $scope.loadTags = function(query) {
      return $scope.tagsSearch;
    };


    // only permit the one tag
    $scope.forceOneTag = function(tags) {
        return (tags.length === 0);
    }


    // remove tag will invoke this function
    $scope.removedTag = function() {
        $scope.isCreateContentTypeEmpty = true;
    }


    // add tag will invoke this function
    $scope.addedTag = function() {
        $scope.isCreateContentTypeEmpty = false;
    }


    $scope.incStep = function(itemIndex, item) {
        item.steps.splice(itemIndex + 1, 0, {key: new Date().getTime(), value: ""});
    }


    $scope.rmvStep = function(itemIndex, item) {
        item.steps.splice(itemIndex, 1);
    }


    $scope.formatListToEs = function(array) {
          var formatted = [];
          angular.forEach(array, function(obj, key) {
              var steps = [];
              angular.forEach(obj.steps, function(val) {
                steps.push(val.value);
              })
              var reason_steps = {"reason": obj.reason, "steps": steps};
              formatted.push(reason_steps);
          });
          return formatted;
    }


    $scope.getDoc = function() {

        // because we only allow 1 component in this field, only get the first index 0 data
        var type = $scope.tags[0].text;
        var defered = $q.defer();

        var url = '/api/details/' + type + '/' + $scope.addContent.id;
        $http({
                url: url,
                method: 'GET'
             }).then(function (data) {
                defered.resolve(data);
             }).catch(function (data) {
                // when hit error, not reject, resolve the error to the checker
                defered.resolve(data);
             });
        return defered.promise;
    };


    $scope.create = function() {
        var reasons_steps = $scope.formatListToEs($scope.items);
        // because we only allow 1 component in this field, only get the first index 0 data
        var type = $scope.tags[0].text;

        var defered = $q.defer();

        var addBody = {
                            "id": $scope.addContent.id,
                            "type": type,
                            "description": $scope.addContent.description,
                            "explanation": $scope.addContent.explanation,
                            "level": $scope.addContent.level,
                            "public": $scope.addContent.public,
                            "impact": $scope.addContent.impact,
                            "reasons_steps": reasons_steps,
                            "reference": $scope.addContent.reference,
                       };
         $http({
                 url: '/api/add/',
                 method: 'PUT',
                 data: addBody
              }).then(function (data) {
                 defered.resolve(data.data.created);
              }).catch(function (data) {
                 defered.reject(false);
              });
          return defered.promise;
    };


    $scope.saveAddContent = function() {

        var promise = $scope.getDoc();

        promise.then(function(data) {
                 $scope.checkAddContentFound = data.data.found;

                 if ($scope.checkAddContentFound){
                     $scope.addFailed = false;
                     $scope.addFailedMessages = "can not create, because the doc is existed!";

                 } else {
                      var addPromise = $scope.create();
                      addPromise.then(function(data) {
                               $scope.addMessages = "create successfully!";
                           }, function(data) {
                               $scope.addFailed = false;
                               $scope.addFailedMessages = "can not create, please check the input!";
                           }).then(function(){
                                  // because we only allow 1 component in this field, only get the first index 0 data
                                  var type = $scope.tags[0].text;
                                  $timeout(function () {
                                      $location.path('detail/' + type + '/' + $scope.addContent.id);
                                      // refresh the whole page after the create to load the nav tree again
                                      window.location.reload();
                                  }, 500);
                           });
                 }
             }, function(data) {
                 $scope.addContentFound = data;
             });
    };


    $scope.cancelAddContent = function() {
        $location.path("search");
    };

});

