'Use Strict';

let deviceModel = require('../models/devices');
let lightModel = require('../models/lights');
let sensorModel = require('../models/sensors');
let userModel = require('../models/users');
let logsModel = require('../models/logs');
let remoteModel = require('../models/remotes');
let thingsModel = require('../models/things');

module.exports = {
    newUser: (req, res) => {
        if (!req.body.username || !req.body.password || !req.body.email) {
            res.status("400");
            res.send("no details provided");
        } else {
            userModel.create(req.body).then(
                function(result) {
                    req.session.user = req.body.user;
                    req.session.userid = result;
                    res.status(201);
                    res.send("success");
                }
            ).catch(
                function() {
                    res.status(400);
                    res.send("failure");
                }
            )
        }
    },

    validateLogin: (req, res) => {
        if(!req.body.username || !req.body.password) {
            res.status("400");
            res.send("no details provided");
        } else {
            userModel.validateLogin(req.body).then(
                function(result) {
                    req.session.user = req.body.username;
                    req.session.userid = result[0].UserID;

                    res.status(201);
                    res.send({result: 'OK', message: 'Session updated'});
                }
            ).catch(
                function() {
                    res.status(400);
                    res.send("failure");
                }
            )
        }
    },

    deviceNames: (req, res) => {
        deviceModel.getNames(req.session).then((results) => 
            {
                if (results == "no results") {
                    res.status(204);
                    res.send(results);
                } else {
                    res.status(200);
                    res.send(results);
                }
                
            }
        ).catch(
            function() {
                res.status(400);
                res.send("failure");
            }
        )
    },
    
    registerDevice: (req, res) => {
        userModel.registerDevice(req).then(
            function() {
                res.status(200);
                res.send("success");
            }
        ).catch(
            function() {
                res.status(400);
                res.send("failure");
            }
        )
    },

    reading: (req, res) => {

        //compile values to be added to database in format (deviceid, thingid, thingstate)
        var values = "";
        if (req.body) {

            //generate value string to reduce number of queries
            for (var i = 0; i < req.body.THINGS.length; i++) {
                if (i != req.body.THINGS.length-1) {
                    values += `(${req.body.DEVICE_ID}, ${req.body.THINGS[i].id}, ${req.body.THINGS[i].state}),`
                } else {
                    values += `(${req.body.DEVICE_ID}, ${req.body.THINGS[i].id}, ${req.body.THINGS[i].state})`
                }
            }

            //query the database with the values
            logsModel.add(values).then( 
                function() {
                    res.status(200);
                    res.send("success");
                }
            ).catch(
                function() {
                    res.status(400);
                    res.send(failure);
                }
            )
            
        } else {
            res.status(400);
            res.send("test");
        }
    },

    getTop: (req, res) => {
        logsModel.getTop(req.params.deviceid, req.params.limit).then(
            function(results) {
                res.status(200);
                res.send(results);
            }
        ).catch(
            function() {
                res.status(400);
                res.send("failure");
            }
        )
    },

    getDeviceThings: (req, res) => {
        logsModel.getAllByType(req.params.deviceid, req.params.type).then(
            function(results) {
                res.status(200);
                res.send(results);
            }
        ).catch(
            function() {
                res.status(400);
                res.send("failure");
            }
        )
    },

    setThing: (req, res) => {
        var value = `(${req.params.deviceid}, ${req.params.thingid}, ${req.params.thingstate})`
        logsModel.add(value).then(
            function() {
                res.status(200);
                res.send("success");
            }
        ).catch(
            function() {
                res.status(400);
                res.send("failure");
            }
        )
    },

    countDevice: (req, res) => {
        logsModel.countDevices(req.params.deviceid).then(
            function(results) {
                res.status(200);
                res.send(results);
            }
        ).catch(
            function() {
                res.status(400);
                res.send("failure");
            }
        )
    },

    countThing: (req, res) => {
        logsModel.countThing(req.params.deviceid, req.params.thingid).then(
            function(results) {
                res.status(200);
                res.send(results);
            }
        ).catch(
            function() {
                res.status(400);
                res.send("failure");
            }
        )
    },

    countAllThings: (req, res) => {
        logsModel.countAllThings(req.params.deviceid).then(
            function(results) {
                res.status(200);
                res.send(results);
            }
        ).catch(
            function() {
                res.status(400);
                res.send("failure");
            }
        )
    },

    countByCategory: (req, res) => {
        thingsModel.countByCategory(req.params.deviceid, req.params.category).then(
            function(results) {
                res.status(200);
                res.send(results);
            }
        ).catch(
            function() {
                res.status(400);
                res.send("failure");
            }
        )
    },

    getThing: (req, res) => {
        thingsModel.getState(req.params.deviceid, req.params.thingid, req.params.type).then(
            function(results) {
                res.status(200);
                res.send(results);
            }
        ).catch(
            function() {
                res.status(400);
                res.send("failure");
            }
        )
    },
}