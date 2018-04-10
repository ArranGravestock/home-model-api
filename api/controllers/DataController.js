'Use Strict';

let deviceModel = require('../models/devices');
let lightModel = require('../models/lights');
let sensorModel = require('../models/sensors');
let userModel = require('../models/users');
let logsModel = require('../models/logs');
let remoteModel = require('../models/remotes');

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
                res.status(201);
                res.send(results);
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
    
    lights: (req, res) => {
        lightModel.returnAll(req.params.deviceid).then(
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

    getSensor: (req, res) => {
        sensorModel.getState(req.params.deviceid, req.params.sensorid).then(
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

    getRemotes: (req, res) => {
        remoteModel.returnAll(req.params.deviceid).then(
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

    getSensors: (req, res) => {
        sensorModel.returnAll(req.params.deviceid).then(
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

    setLight: (req, res) => {
        var value = `(${req.params.deviceid}, ${req.params.lightid}, ${req.params.lightstate})`
        console.log(value)
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
}