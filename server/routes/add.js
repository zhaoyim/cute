"use strict";

var express = require('express');
var http = require('http');
var Q = require('q');
var config = require('../conf/config');
var router = express.Router();



var callEsCreate = function(putBody){
  var deferred = Q.defer();

  var path = '/cute/' + putBody.type + '/' + putBody.id;

  var options = {
      host: config.elaticsearch.hostname,
      port: config.elaticsearch.port,
      path: path,
      method: 'PUT',
      headers:{
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      }
  };

  var results = '';

  var createReq = http.request(options, function (createRes) {

      createRes.setEncoding('utf8');
      createRes.on('data',function (d) {
            results = results + d;
      });

      createRes.on('end', function(){
          deferred.resolve(results);
      });
  });

  // set the create body for the es rest api call
  // here parse the json object to the string to ES
  createReq.write(JSON.stringify(putBody));

  createReq.on('error', function(e) {
      console.log('problem with request: ' + e.message);
  });

  createReq.end();
  return deferred.promise;

}


/* PUT ES create document api call */
router.put('/', function(req, res, next) {
  callEsCreate(req.body).then(function (result) {
      res.send(result);
  });

});

module.exports = router;
