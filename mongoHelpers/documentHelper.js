/**
 * Created by nuwanm on 12/16/16.
 */
var MongoClient = require('mongodb').MongoClient;

var url = "mongodb://dev:dev@ds133348.mlab.com:33348/fueltracking";

module.exports = {

    findOneDocument: function (collectionName, item, callback) {
        MongoClient.connect(url, function (err, db) {
            if (err) {
                console.error(err);
                callback(null);
                return null;
            }
            var collection = db.collection(collectionName);
            collection.findOne(item, function (err, item) {
                if (err) {
                    console.error(err);
                    callback(null);
                    return null
                }
                console.log('findOneDocument: Item found: ', item);
                callback(item);
                return item;
            });
        });
    },

    findAllDocument: function (collectionName, item, callback) {
        MongoClient.connect(url, function (err, db) {
            if (err) {
                console.error(err);
                callback(null);
                return null;
            }
            var collection = db.collection(collectionName);
            collection.find(item, function (err, item) {
                if (err) {
                    console.error(err);
                    callback(null);
                    return null
                }
                console.log('findAllDocument: Items found');
                callback(item);
                return item;
            });
        });
    },

    saveDocuemt: function (collectionName, item, callback) {
        MongoClient.connect(url, function (err, db) {
            if (err) {
                console.error('saveDocuemt: connection failed: ', err);
                callback(null);
                return null;
            }
            db.createCollection(collectionName, function (err, collection) {

                collection.insert(item, {w: 1}, function (err, result) {
                    console.error(err);
                    if (err) {
                        console.error('saveDocuemt: insert error: ', err);
                        callback(null);
                        return null;
                    }
                    console.log("saveDocuemt: Item saved: ", item);
                    callback(result);
                    return result;
                });
            });
        });
    },

    updateDocument: function (collectionName, item, updatedDocument, callback) {
        MongoClient.connect(url, function (err, db) {
            if (err) {
                console.error(err);
                callback(null);
                return null;
            }
            var collection = db.collection(collectionName);
            collection.updateOne(item,  updatedDocument, {w: 1}, function (err, item) {
                if (err) {
                    console.error(err);
                    callback(null);
                    return null
                }
                // console.log('updateDocument: Item updated: ', item);
                callback(item);
                return item;
            });
        });
    }


};
