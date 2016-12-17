/**
 * Created by nuwanm on 12/16/16.
 */
var express = require('express');
var app = express();
var path = require('path');

app.get('/',function (req,res) {
    var username = req.query.username;
    var vehicleNo = req.query.vehicleNo;
    res.sendFile(path.join(__dirname, '../views/home.html'))
});

module.exports = app;