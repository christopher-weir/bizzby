'use strict';

/**
 * Module dependencies.
 */
require('babel-core/register');
var express = require('express');
var cluster = require('express-cluster');
var path    = require('path');

cluster(function(worker) {
    // Initialize express
    var app = express();

    app.use(express.static(__dirname + '/public'));

    app.get('/', function (req, res) {
      res.sendFile(path.join(__dirname+'/public/index.html'));
    });

    // Logging initialization
    console.log('Application started on port ' + 3000);

    // Start the app by listening on <port>
    return app.listen(3000);
});
