"use strict";

var express = require('express');
var http = require('http');
var Q = require('q');
var config = require('../conf/config');
var router = express.Router();



var callEsDelete = function(type, id){

  var deferred = Q.defer();

  var path = '/cute/' + type + '/' + id;

  var options = {
      host: config.elaticsearch.hostname,
      port: config.elaticsearch.port,
      path: path,
      method: 'DELETE',
      headers:{
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      }
  };

  var results = '';

  var deleteReq = http.request(options, function (deleteRes) {

      deleteRes.setEncoding('utf8');
      deleteRes.on('data',function (d) {
            results = results + d;
      });

      deleteRes.on('end', function(){
          deferred.resolve(results);
      });
  });

  deleteReq.on('error', function(e) {
      console.log('problem with request: ' + e.message);
  });

  deleteReq.end();
  return deferred.promise;

}


/* DELETE ES delete api call */
router.delete('/:type/:id', function(req, res, next) {

  callEsDelete(req.params.type, req.params.id).then(function (result) {
      res.send(result);
  });

});

module.exports = router;
