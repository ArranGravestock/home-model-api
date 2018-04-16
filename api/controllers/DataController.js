'Use Strict';

let deviceModel = require('../models/devices');
let userModel = require('../models/users');
let logsModel = require('../models/logs');
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
            function(result) {
                res.status(400);
                res.send(result);
            }
        )
    },

    reading: (req, res) => {

        if (req.body) {
            //insert every value into db
            for (var i = 0; i < req.body.THINGS.length; i++) {
                var value = {DeviceID: parseInt(req.body.DEVICE_ID), ThingID: parseInt(req.body.THINGS[i].id), ThingState: req.body.THINGS[i].state}
                logsModel.add(value)
                .catch(
                    () => {
                        //not sure how this responds if it breaks when one value is wrong
                        res.status(400);
                        res.send(failure);
                    }
                )
            }
            res.status(200);
            res.send("success");
        } else {
            res.status(400);
            res.send("fail");
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
        var state = req.params.thingstate;

        if (req.params.thingstate == "true") {
            state = 1;
        } else {
            state = 0;
        }
        var value = {DeviceID: parseInt(req.params.deviceid), ThingID: parseInt(req.params.thingid), ThingState: state}

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