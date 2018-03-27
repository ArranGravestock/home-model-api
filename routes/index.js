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
})

router.post('/logout', function(req, res) {
    req.session.destroy(function (err) {
        if (err) {
            console.log(err);
        }
    })
})

//retrieve
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

 router.get('/devices', authoriseUser, function(req, res) {
    //console.log(req.session);
    console.log("reached 31");
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


/*
var fs = require("fs");``
app.get('/test', function(req, res) {
    fs.readFile(__dirname + "/" + "server_test.json", 'utf8', function(err, data) {
        var test = JSON.parse(data);
        console.log(test);
        res.end(data);
    })
})

app.get('/:device/:roomid', function(req, res) {
    fs.readFile(__dirname + "/" + "server_test.json", 'utf8', function(err, data) {
        var device = JSON.parse(data);
        var rooms = device[req.params.device]
        var room_items = rooms[req.params.roomid]
        console.log(room_items);
        res.end(JSON.stringify(room_items));
    })
})
*/

module.exports = router;
