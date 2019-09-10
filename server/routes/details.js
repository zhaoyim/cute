"use strict";

var express = require('express');
var http = require('http');
var Q = require('q');
var config = require('../conf/config');
var router = express.Router();



var callEsDetails = function(type, id){

  var deferred = Q.defer();

  var path = '/cute/' + type + '/' + id;

  var options = {
      host: config.elaticsearch.hostname,
      port: config.elaticsearch.port,
      path: path,
      method: 'GET',
      headers:{
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      }
  };

  var results = '';

  var detailsReq = http.request(options, function (detailsRes) {

      detailsRes.setEncoding('utf8');
      detailsRes.on('data',function (d) {
            results = results + d;
      });

      detailsRes.on('end', function(){
          deferred.resolve(results);
      });
  });

  detailsReq.on('error', function(e) {
      console.log('problem with request: ' + e.message);
  });

  detailsReq.end();
  return deferred.promise;

}


/* GET details api call */
router.get('/:type/:id', function(req, res, next) {

  callEsDetails(req.params.type, req.params.id).then(function (result) {
      res.send(result);
  });

});

module.exports = router;
