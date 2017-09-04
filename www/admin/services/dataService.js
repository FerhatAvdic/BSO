(function () {
    'use strict';

    var bsoAdmin = angular.module("bsoAdmin");

    bsoAdmin.factory("dataService", ['$http', '$rootScope', '$q', function ($http, $rootScope, $q) {

        var source = "/api/";

        //$http.defaults.headers.common['Token'] = currentUser.token;
        //$http.defaults.headers.common['ApiKey'] = config.apiKey;

        //DATE
        var days = [];
        for (var i = 1; i <= 31; i++) {
            if (i < 10)
                days.push("0" + i);
            else
                days.push(i.toString());
        };
        var months = [];
        for (var i = 1; i <= 12; i++) {
            if (i < 10)
                months.push("0" + i);
            else
                months.push(i.toString());
        };
        var currentYear = new Date().getFullYear();
        var years = [];
        for (var i = 1950; i <= currentYear; i++) {
            years.push(i.toString());
        };

        var dates = {
            years: years,
            months: months,
            days: days,

            year: currentYear.toString(),
            month: "01",
            day: "01"
        };

        //PHONE
        var countries = [
            { name: "BiH", number: "+387" },
            { name: "Hrv", number: "+385" },
            { name: "Srb", number: "+381" },
            { name: "Slo", number: "+386" }
        ];

        function download(url, defaultFileName) {
            var deferred = $q.defer();
            $http.get(url, { responseType: "arraybuffer" }).success(
                function (data, status, headers) {
                    var type = headers('Content-Type');
                    var disposition = headers('Content-Disposition');
                    if (disposition) {
                        var match = disposition.match(/.*filename=\"?([^;\"]+)\"?.*/);
                        if (match[1])
                            defaultFileName = match[1];
                    }
                    defaultFileName = defaultFileName.replace(/[<>:"\/\\|?*]+/g, '_');
                    var blob = new Blob([data], { type: type });
                    saveAs(blob, defaultFileName);
                    deferred.resolve(defaultFileName);
                }).error(function () {
                    deferred.reject();
                });
            return deferred.promise;
        }

        return {

            //CRUD
            list: function (dataSet, callback) {
                $http.get(source + dataSet)
                .then(function (result) {
                    return callback(result);
                }, function (result) {
                    callback(result);
                });
            },

            read: function (dataSet, id, callback) {
                $http.get(source + dataSet + "/" + id)
                     .then(function (result) {
                         return callback(result);
                     }, function (result) {
                         callback(result);
                     });
            },
            readByQuery: function(dataSet, data, callback) {
                $http({ method: "get", url: source + dataSet, params: data })
                     .then(function (result) {
                         return callback(result);
                     }, function (result) {
                         callback(result);
                     });
            },

            create: function (dataSet, data, callback) {
                $http({ method: "post", url: source + dataSet, data: data })
                   .then(function (result) {
                       return callback(result);
                   }, function (result) {
                       callback(result);
                   });
            },

            update: function (dataSet, id, data, callback) {
                $http({ method: "put", url: source + dataSet + "/" + id, data: data })
                   .then(function (result) {
                       return callback(result);
                   }, function (result) {
                       callback(result);
                   });
            },

            remove: function (dataSet, id, callback) {
                $http({ method: "delete", url: source + dataSet + "/" + id })
                     .then(function (result) {
                         return callback(result);
                     }, function (result) {
                         callback(result);
                     });
            },

            countries: countries,
            dates: dates

        };
    }]);
}());
