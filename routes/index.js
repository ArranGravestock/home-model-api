'Use Strict';
//sudo service mysql start
var express = require('express');
var router = express.Router();

var dataController = require('../api/controllers/DataController');
var database = require('../api/models/database');

//functions middleware
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

router.post('/registerdevice/:token', authoriseUser, function(req, res) {
    dataController.registerDevice(req, res);
})


//server reading - adds all data to logs
router.put('/reading', function(req, res) {
    dataController.reading(req, res);
})


//retrieve
 router.get('/devices', authoriseUser, function(req, res) {
   dataController.deviceNames(req, res);
})

router.get('/device/:deviceid/lights', authoriseUser, function(req, res) {
    dataController.lights(req, res);
})

router.get('/device/:deviceid/sensor/:sensorid', authoriseUser, function(req, res) {
    dataController.getSensor(req, res);
})






module.exports = router;
