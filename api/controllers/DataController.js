'Use Strict';

let deviceModel = require('../models/devices');
let lightModel = require('../models/lights');
let roomModel = require('../models/rooms');
let sensorModel = require('../models/sensors');
let userModel = require('../models/users');

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
    DeviceNames: (req, res) => {
        console.log("reached 47");
        deviceModel.getDevices(req.session).then((results) => 
            {
                res.status(201);
                console.log(results);
                res.send(results);
            }
        ).catch(
            function() {
                res.status(400);
                res.send("failure");
            }
        )
    },
    
    DeviceRooms: (req, res) => {
        deviceModel.getDeviceRooms(req.params).then(
            function() {
                res.status(204);
                res.send("success");
            }
        ).catch(
            function() {
                res.status(400);
                res.send("failure");
            }
        )
    },
    
    RoomLights: (req, res) => {
        roomModel.RoomLights(req.params).then(
            function() {
                res.status(201);
                res.send("success");
            }
        ).catch(
            function() {
                res.status(400);
                res.send("failure");
            }
        )
    },
    
    RoomSensors: (req, res) => {
        roomModel.RoomSensors(req.params).then(
            function() {
                res.status(201);
                res.send("success");
            }
        ).catch(
            function() {
                res.status(400);
                res.send("failure");
            }
        )
    },
    
    SensorState: (req, res) => {
        sensorModel.SensorState(req.params).then(
            function() {
                res.status(201);
                res.send("success");
            }
        ).catch(
            function() {
                res.status(400);
                res.send("failure");
            }
        )
    },
    
    LightState: (req, res) => {
        lightModel.LightState(req.params).then(
            function() {
                res.status(201);
                res.send("success");
            }
        ).catch(
            function() {
                res.status(400);
                res.send("failure");
            }
        )
    },
    DeviceLights: (req, res) => {
        lightModel.returnAll(req.params).then(
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
    RegisterDevice: (req, res) => {
        userModel.RegisterDevice(req).then(
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
    }
}