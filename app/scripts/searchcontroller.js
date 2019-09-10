'use strict';

function searchcontroller($scope, $http, $routeParams, $location, $window, $q, $translate, $timeout, DTOptionsBuilder, DTColumnBuilder, CONFIG) {

    $scope.searchContent = $routeParams.searchContent;
    // set the searchcontroller parent's parent's searchContent,
    // this is not a good way, just here for quick fix the issue
    $scope.navctrl.searchContent = $scope.searchContent;


    $scope.formatHLData = function(highLight) {
        var str = "";
        angular.forEach(highLight, function(value, key) {
            switch (key)
            {
                case "id":
                    str = str + $translate.instant('detail.label.id') + ": " + value.join("") + "<br/>";
                    break;
                case "type":
                    str = str + $translate.instant('detail.label.type') + ": " + value.join("") + "<br/>";
                    break;
                case "description":
                    str = str + $translate.instant('detail.label.description') + ": " + value.join("") + "<br/>";
                    break;
                case "explanation":
                    str = str + $translate.instant('detail.label.explanation') + ": " + value.join("") + "<br/>";
                    break;
                case "level":
                    str = str + $translate.instant('detail.label.level') + ": " + value.join("") + "<br/>";
                    break;
                case "impact":
                    str = str + $translate.instant('detail.label.impact') + ": " + value.join("") + "<br/>";
                    break;
                case "reasons_steps.reason":
                    str = str + $translate.instant('detail.label.reason') + ": ";
                    angular.forEach(value, function(v, k) {
                        str = str + (k + 1) + "." + v + "&nbsp;";
                    });
                    str = str + "<br/>";
                    break;
                case "reasons_steps.steps":
                    str = str + $translate.instant('detail.label.steps') + ": ";
                    angular.forEach(value, function(v, k) {
                        str = str + (k + 1) + "." + v + "&nbsp;";
                    });
                    str = str + "<br/>";
                    break;
                case "reference":
                    str = str + $translate.instant('detail.label.reference') + ": " + value.join("") + "<br/>";
                    break;
                default:
                    str = "";
            }
        });
        return str;
    };


    $scope.formatSourceData = function(source) {
        var str = "";
        str = $translate.instant('detail.label.id') + ": " + source.id + "<br/>" +
                $translate.instant('detail.label.type') + ": " + source.type + "<br/>" +
                $translate.instant('detail.label.description') + ": " + source.description + "<br/>" +
                $translate.instant('detail.label.explanation') + ": " + source.explanation + "<br/>" +
                $translate.instant('detail.label.level') + ": " + source.level + "<br/>" +
                $translate.instant('detail.label.impact') + ": " + source.impact + "<br/>";

        str = str + $translate.instant('detail.label.reason') + ": ";
        angular.forEach(source.possible_cause, function(v, k) {
            str = str + (k + 1) + "." + v;
        });
        str = str + "<br/>";

        str = str + $translate.instant('detail.label.steps') + ": ";
        angular.forEach(source.processing_step, function(v, k) {
            str = str + (k + 1) + "." + v;
        });
        str = str + "<br/>";

        str = str + $translate.instant('detail.label.reference') + ": " + source.reference + "<br/>";

        return str;
    };


    $scope.search = function() {
        var defered = $q.defer();

        var query = {"query": $scope.searchContent };

        $http({
                url: '/api/search',
                method: 'POST',
                data: query
             }).then(function (result) {
                $scope.data = result;
                defered.resolve(result.data.hits.hits);
             }).catch(function (result) {
                defered.reject(result);
             });
         return defered.promise;
    };


   function actionsHtml(data) {
          var idLink = '<a target="_blank" href="#!/detail/' +
                                data._type +
                                '/' +
                                data._id +
                                '">' +
                                data._id +
                               '</a><br/>';
         if (typeof(data.highlight) === 'undefined') {
            return idLink + $scope.formatSourceData(data._source);
         } else {
            return idLink + $scope.formatHLData(data.highlight);
         }
    }


    var promise = $scope.search();

    $scope.dtOptions = DTOptionsBuilder
                        .fromFnPromise(promise)
                        .withPaginationType('full_numbers')
                        .withOption('searching', false)
                        .withOption('lengthChange', false)
                        .withOption('stateSave', false)
                        .withOption('ordering', false)
                        .withDisplayLength(10)
                        .withLanguage({
                            "oPaginate": {
                                "sFirst": "&lt;&lt;",
                                "sLast": "&gt;&gt;",
                                "sNext": "&gt;",
                                "sPrevious": "&lt;"
                            },
                            "sEmptyTable": $translate.instant('index.table.sEmptyTable'),
                            "sInfo": $translate.instant('index.table.sInfo'),
                            "sInfoEmpty": $translate.instant('index.table.sInfoEmpty'),
                            "sLoadingRecords": $translate.instant('index.table.sLoadingRecords')
                        });

    $scope.dtColumns = [
        DTColumnBuilder.newColumn(null).withTitle($translate('index.table.search.results')).notSortable()
            .renderWith(actionsHtml)
    ];

}
