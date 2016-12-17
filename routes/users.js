var express = require('express');
var app = express();
var sha256 = require('sha256');
var collectionName = 'users';
var mongoDocumentHelper = require('../mongoHelpers/documentHelper');
var path = require('path');

app.post('/login', function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    var pwd = sha256(password);
    mongoDocumentHelper.findOneDocument(collectionName, {'username': username}, function (callback) {
        if (callback && callback.password == pwd) {
            console.log('Logged in user: ', callback);
            res.redirect('/home?username=' + callback.username + '&vehicleNo=' + callback.vehicleNo);
        } else if (callback && callback.password != pwd) {
            res.send("Invalid username or password");
        } else {
            res.send("Sorry no users found");
        }
    });
});

app.post('/signup', function (req, res) {
    var username = req.body.username;
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var password = req.body.password;
    var vehicleNo = req.body.vehicleNo;
    var vehicleType = req.body.vehicleType;
    var fuelCapacity = req.body.fuelCapacity;
    var deviceId = req.body.deviceId;

    var newUser = {
        username: username,
        firstname: firstname,
        lastname: lastname,
        password: sha256(password),
        vehicleNo: vehicleNo,
        vehicleType: vehicleType,
        fuelCapacity: fuelCapacity,
        deviceId: deviceId
    };

    mongoDocumentHelper.findOneDocument(collectionName, {'username': username}, function (callback) {
        if (callback) {
            res.send("User already exists");
        } else {
            mongoDocumentHelper.saveDocuemt(collectionName, newUser, function (callback) {
                if (callback) {
                    res.redirect('/home?username=' + username + '&vehicleNo=' + vehicleNo);
                } else {
                    res.send("Sorry error occurred");
                }
            });

        }
    });
});

app.get('/update', function (req, res) {
    res.sendFile(path.join(__dirname,'../views/updateInfo.html'))
});

app.post('/update', function (req, res) {
    var username = req.body.username;
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var password = req.body.password;
    var vehicleNo = req.body.vehicleNo;
    var vehicleType = req.body.vehicleType;
    var fuelCapacity = req.body.fuelCapacity;
    var deviceId = req.body.deviceId;
    var _id = req.body._id;
//        $set: {deviceId: deviceId}

    var newUser = {
        "username": username,
        "firstname": firstname,
        "lastname": lastname,
        "password": sha256(password),
        "vehicleNo": vehicleNo,
        "vehicleType": vehicleType,
        "fuelCapacity": fuelCapacity,
        "deviceId": deviceId
    };

    console.log('update user: newUser', newUser);
    mongoDocumentHelper.updateDocument(collectionName, {'username': username}, newUser, function (callback) {
        if (callback) {
            res.send("User updated successfully");
        } else {
            res.send("Error updating user");
        }
    });
});

app.get('/getUser', function (req, res) {
    var username = req.query.username;
    mongoDocumentHelper.findOneDocument(collectionName, {'username': username}, function (callback) {
        if (callback) {
            console.log('getUser: user: ', callback);
            res.send(JSON.stringify(callback));
        } else {
            res.sendStatus(500);
        }
    });
});

module.exports = app;
