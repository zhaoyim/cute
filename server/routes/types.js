"use strict";

var express = require('express');
var http = require('http');
var Q = require('q');
var config = require('../conf/config');
var router = express.Router();


var callEsMappings = function(){

  var deferred = Q.defer();

  var options = {
      host: config.elaticsearch.hostname,
      port: config.elaticsearch.port,
      path: '/cute',
      method: 'GET',
      headers:{
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      }
  };

  var results = '';

  var mappingReq = http.request(options, function (mappingRes) {

      mappingRes.setEncoding('utf8');
      mappingRes.on('data',function (d) {
            results = results + d;
      });

      mappingRes.on('end', function(){
          deferred.resolve(results);
      });
  });

  mappingReq.on('error', function(e) {
      console.log('problem with request: ' + e.message);
  });

  mappingReq.end();
  return deferred.promise;

}


/* GET types names*/
router.get('/names', function(req, res, next) {

  callEsMappings().then(function (result) {
      res.send(result);
  });

});


var callEsSearchTypeIds = function(query){

  var deferred = Q.defer();

  var query = '{' +
                  '"size": 10000,' +
                  '"sort" : [' +
                      '{"id" : "asc"}' +
                  '],' +
                  '"query" : {' +
                      '"term" : { "_type" :"' +  query + '"}' +
                  '}' +
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


/* POST search type ids api call */
router.post('/ids', function(req, res, next) {

  callEsSearchTypeIds(req.body.query).then(function (result) {
      res.send(result);
  });

});


module.exports = router;
