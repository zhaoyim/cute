'use strict';

function detailcontroller($scope, $http, $routeParams, $q, docTypesFactory, navDetailFactory, CONFIG) {

    $scope.internalUse = CONFIG.internalUse;
    $scope.editTypesSelectOption = docTypesFactory._getTypes();
    $scope.editFailed = false;
    $scope.editFailedMessages = "";
    $scope.editSuccessfully = false;
    $scope.editSuccessfullyMessages = "";

    $scope.isEditContentTypeEmpty = false;

    // set the type and id into the details scope
    $scope.type = $routeParams.type;
    $scope.id = $routeParams.id;

    // set the type and id to the nav and details services
    navDetailFactory._setDetails({
        "type": $scope.type,
        "id": $scope.id
    });


    $scope.editTags = [];

    $scope.editLevels = CONFIG.levels;
    $scope.editPublic = CONFIG.public;

    // init items for reasons and steps
    $scope.items = [];


    $scope.addItem = function() {
      var newItem = {"reason": "", "steps": [{key: 0, value: ""}]};
      $scope.items.push(newItem);
    };


    $scope.removeItem = function($index) {
      $scope.items.splice($index, 1);
    };


    $scope.editTagsSearch = [];
    angular.forEach($scope.editTypesSelectOption, function(value, key) {
        $scope.editTagsSearch.push({ "text": value });
    });


    $scope.loadTags = function(query) {
      return $scope.editTagsSearch;
    };


    // only permit the one tag
    $scope.forceOneTag = function(tags) {
        return (tags.length === 0);
    }


    // remove tag will invoke this function
    $scope.removedTag = function() {
        $scope.isEditContentTypeEmpty = true;
    }


    // add tag will invoke this function
    $scope.addedTag = function() {
        $scope.isEditContentTypeEmpty = false;
    }


    $scope.incStep = function(itemIndex, item) {
        item.steps.splice(itemIndex + 1, 0, {key: new Date().getTime(), value: ""});
    }


    $scope.rmvStep = function(itemIndex, item) {
        item.steps.splice(itemIndex, 1);
    }


    $scope.list = function() {

        var defered = $q.defer();
        var url = '/api/details/' + $scope.type + '/' + $scope.id;
        $http({
                url: url,
                method: 'GET'
             }).then(function (data) {
                defered.resolve(data);
             }).catch(function (data) {
                defered.reject(data);
             });
        return defered.promise;
    };


    $scope.setEditContent = function(data) {
             $scope.editContent = {};
             $scope.editTags = [];
             $scope.items = [];

             $scope.editContent.id = data.data._source.id;
             $scope.editContent.description = data.data._source.description;
             $scope.editContent.explanation = data.data._source.explanation;
             $scope.editContent.level = data.data._source.level;
             $scope.editContent.public = data.data._source.public;
             $scope.editContent.impact = data.data._source.impact;
             $scope.editContent.reference = data.data._source.reference;

             $scope.editTags.push({ "text": data.data._source.type });

             angular.forEach(data.data._source.reasons_steps, function(value) {
                  var steps = [];
                  angular.forEach(value.steps, function(val, key) {
                       steps.push({key: key, value: val});
                  });
                  var existItem = {"reason": value.reason, "steps": steps};
                  $scope.items.push(existItem);
             });
    }


    var promise = $scope.list();

    promise.then(function(data) {
             $scope.detail = data.data;
             $scope.setEditContent(data);
         }, function(data) {
             $scope.detail = {error: 'can not find'};
    });


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


    $scope.update = function() {
        var reasons_steps = $scope.formatListToEs($scope.items);
        // because we only allow 1 component in this field, only get the first index 0 data
        var type = $scope.editTags[0].text;

        var defered = $q.defer();

        var editBody = {
                            "id": $scope.editContent.id,
                            "type": type,
                            "description": $scope.editContent.description,
                            "explanation": $scope.editContent.explanation,
                            "level": $scope.editContent.level,
                            "public": $scope.editContent.public,
                            "impact": $scope.editContent.impact,
                            "reasons_steps": reasons_steps,
                            "reference": $scope.editContent.reference,
                       };
         $http({
                 url: '/api/edit/',
                 method: 'PUT',
                 data: editBody
              }).then(function (data) {
                 defered.resolve(data.status);
              }).catch(function (data) {
                 defered.reject(data.status);
              });
          return defered.promise;
    };


    $scope.refresh = function() {
       var promise = $scope.list();
       promise.then(function(data) {
                $scope.detail = data.data;

                $scope.setEditContent(data);
            }, function(data) {
                $scope.detail = {error: 'can not find'};
            });

    }


    $scope.saveEditContent = function() {
        var editPromise = $scope.update();
        editPromise.then(function(data) {
                 $scope.editSuccessfullyMessages = "Edit successfully!";
                 $scope.editSuccessfully = true;
                 $scope.refresh();
             }, function(data) {
                 $scope.editMessages = "can not edit the doc info hit the error: " + data;
        });

        $('#editModal').modal('hide')
    };


}
