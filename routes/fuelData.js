/**
 * Created by nuwanm on 12/17/16.
 */
var express = require('express');
var app = express();
var collectionName = 'fuel';
var mongoDocumentHelper = require('../mongoHelpers/documentHelper');

app.get('/getData', function (req, res) {
    var start = req.query.start;
    var end = req.query.end;
    var vehicleNo = req.query.vehicleNo;
    var query = {
        date: {
            $gte: new Date(start + "T00:00:00.000Z"),
            $lt: new Date(end + "T23:59:59.000Z")
        }
    };
    if (vehicleNo) {
        query['vehicleNo'] = vehicleNo;
    }
    mongoDocumentHelper.findAllDocument(collectionName, query, function (callback) {
        if (callback) {
            callback.toArray(function (err, docs) {
                console.log('All docs', docs);
                res.send(docs);
            });
        } else {
            res.send({});
        }
    })

});

app.post('/addData', function (req, res) {

    var lat = req.body.lat;
    var lng = req.body.lng;
    var percentage = parseFloat(req.body.percentage) / 100;
    var deviceId = req.body.deviceId;

    var center = {lat: lat, lng: lng};
    mongoDocumentHelper.findOneDocument('users', {'deviceId': deviceId}, function (callback) {
        if (callback) {
            console.log('User: ', callback);
            var fuelCapacity = callback.fuelCapacity;
            var username = callback.username;
            var vehicleNo = callback.vehicleNo;
            var entry = {
                username: username,
                vehicleNo: vehicleNo,
                deviceId: deviceId,
                fuelCapacity: fuelCapacity,
                center: center,
                date: new Date(),
                percentage: percentage,
                fuelValue: percentage * fuelCapacity
            };
            mongoDocumentHelper.saveDocuemt(collectionName, entry, function (savedResponse) {
                if (savedResponse) {
                    res.sendStatus(200);
                } else {
                    res.sendStatus(500);
                }
            });

        } else {
            res.send("Sorry no users found");
        }
    });
});

module.exports = app;