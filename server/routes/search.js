"use strict";

var express = require('express');
var http = require('http');
var Q = require('q');
var config = require('../conf/config');
var router = express.Router();



var callEsSearch = function(query){
  var deferred = Q.defer();

  var query = '{' +
                  '"sort":  [{ "_score": { "order": "desc" }}],' +
                  '"size": 10000,' +
                  '"query": {' +
                      '"query_string": {' +
                            '"fields" : ["id", "type", "description", "explanation", "level", "impact", "reasons_steps.reason", "reasons_steps.steps", "reference"],' +
                          '"query": "' + query + '",' +
                          '"default_operator": "or"' +
                          '}' +
                      '},' +
                      '"highlight": {"fields": {"id": {}, "type": {}, "description": {}, "explanation": {}, "level": {}, "impact": {}, "reasons_steps.reason": {}, "reasons_steps.steps": {}, "reference": {}}}' +
                '}';

  var options = {
      host: config.elaticsearch.hostname,
      port: config.elaticsearch.port,
      path: '/cute/_search',
      method: 'POST',
      headers:{
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      }
  };

  var results = '';

  var searchReq = http.request(options, function (searchRes) {

      searchRes.setEncoding('utf8');
      searchRes.on('data',function (d) {
            results = results + d;
      });

      searchRes.on('end', function(){
          deferred.resolve(results);
      });
  });

  // set the post query to the es rest api call request body
  searchReq.write(query);

  searchReq.on('error', function(e) {
      console.log('problem with request: ' + e.message);
  });

  searchReq.end();
  return deferred.promise;

}


/* POST search api call */
router.post('/', function(req, res, next) {

  callEsSearch(req.body.query).then(function (result) {
      res.send(result);
  });

});

module.exports = router;
