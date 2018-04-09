'Use Strict';

var Request = require('tedious').Request;
var Connection = require('tedious').Connection;

var database = require('./database');
var connection = database.Connect();

module.exports = {
    LightState: (deviceid, thingid) => {
        return new Promise((resolve, reject) => {
            connection.query(
            `SELECT Things.ThingID, ThingState, CreatedAt, Things.ThingName FROM Logs 
            INNER JOIN Things ON Things.DeviceID = Logs.DeviceID AND Things.ThingID = Logs.ThingID
            WHERE Logs.DeviceID = ?
            AND Things.ThingID = ?
            AND CreatedAt = (
                SELECT MAX(CreatedAt) 
                FROM Logs
            )`, [deviceid, thingid],
            function(err, results) {
                if (err) {
                    reject(err);
                } else {
                    if(!results.length) {
                        reject(false);
                    } else {
                        resolve(results);
                    }
                }
            })
        })
    },
    returnAll: (deviceid) => {
        return new Promise((resolve, reject) => {
            connection.query(
                `SELECT Things.ThingID, Things.ThingName, ThingState FROM Logs 
                INNER JOIN Things ON Things.DeviceID = Logs.DeviceID AND Things.ThingID = Logs.ThingID
                WHERE Logs.DeviceID = ?
                AND Things.ThingType = 'light'
                AND CreatedAt = (
                    SELECT MAX(CreatedAt) 
                    FROM Logs
                )`, [deviceid],
                function(err, results) {
                    if (err) {
                        reject(err);
                    } else {
                        console.log(deviceid);
                        console.log(results);
                        resolve(results);
                    }
                }
            )
        })
    }
}