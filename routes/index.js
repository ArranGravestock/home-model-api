'Use Strict';
//sudo service mysql start
var express = require('express');
var router = express.Router();

var dataController = require('../api/controllers/DataController');
var database = require('../api/models/database');

//create
router.post('/signup', function(req, res) {
    dataController.newUser(req, res);
})

router.post('/login', function(req, res) {
    dataController.validateLogin(req, res);
    //console.log(req.socket);
})

router.post('/logout', function(req, res) {
    req.session.destroy(function (err) {
        if (err) {
            console.log(err);
        }
    })
})

router.post('/registerdevice/:token', authoriseUser, function(req, res) {
    dataController.RegisterDevice(req, res);
})

//update
router.put('/device/:deviceid/sensor/:sensorid/:sensorstate', function(req, res) {
    dataController.UpdateSensor(req, res);
})

router.put('/reading', function(req, res) {
    dataController.Reading(req, res);
})

//retrieve
 router.get('/devices', authoriseUser, function(req, res) {
   dataController.DeviceNames(req, res);
})

router.get('/device/:deviceid/rooms', function(req, res) {
    dataController.DeviceRooms(req, res);
})

router.get('/device/:deviceid/lights', authoriseUser, function(req, res) {
    dataController.DeviceLights(req, res);
})

router.get('/device/:deviceid/room/:roomid/lights', function(req, res) {
    dataController.RoomLights(req, res);
})

router.get('/device/:deviceid/room/:roomid/sensors', function(req, res) {
    dataController.RoomSensors(req, res);
})

router.get('/device/:deviceid/room/:roomid/sensor/:sensorid', function(req, res) {
    dataController.SensorState(req, res);
})

router.get('/device/:deviceid/room/:roomid/light/:lightid', function(req, res) {
    dataController.LightState(req, res);
})

function authoriseUser(req, res, next){
    console.log(`Query attempt by session... ${req.session.user}:${req.session.userid}`)
    if(req.session.user && req.session.userid){
        console.log("reached");
        next();
    } else {
       var err = new Error("Not logged in!");
       next(err);
    }
 }

module.exports = router;
