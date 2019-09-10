'use strict';
var configApp = angular.module('cuteConfigApp', []);

configApp.constant('CONFIG', {
                        "internalUse": true,
                        // the levels for the problem level in the create and edit modal
                        "levels": ["INFO", "WARN", "ERROR", "FATAL"],
                        // the public information for the public or not in the create and edit modal
                        "public": ["PUBLIC", "PRIVATE"]
                    }
                  );
