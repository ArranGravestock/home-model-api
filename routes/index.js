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
        } else {
            console.log("user logged out");
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

router.get('/device/:deviceid/type/:type', authoriseUser, function(req, res) {
    dataController.getDeviceThings(req, res);
})

router.get('/device/:deviceid/type/:type/:thingid', function(req, res) {
    dataController.getThing(req, res);
})

router.post('/device/:deviceid/thing/:thingid/state/:thingstate', authoriseUser, function(req, res) {
    dataController.setThing(req, res);
})

router.get('/device/:deviceid/top/:limit', authoriseUser, function(req, res) {
    dataController.getTop(req, res);
})

router.get('/device/:deviceid/count', authoriseUser, function(req, res) {
    dataController.countDevice(req, res);
})

router.get('/device/:deviceid/thing/:thingid/count', authoriseUser, function(req, res) {
    dataController.countThing(req, res);
})

router.get('/device/:deviceid/countallthings', authoriseUser, function(req, res) {
    dataController.countAllThings(req, res);
})

router.get('/device/:deviceid/category/:category/count', authoriseUser, function(req, res) {
    dataController.countByCategory(req, res);
})

router.delete('/removedevice/:deviceid', authoriseUser, function(req, res) {
    dataController.userRemoveAccess(req, res);
})


module.exports = router;
