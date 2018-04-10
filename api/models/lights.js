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
                        resolve(results);
                    }
                }
            )
        })
    },
    returnAll: (deviceid) => {
        return new Promise((resolve, reject) => {
            connection.query(
                `SELECT Logs.DeviceID, Logs.ThingID, Logs.ThingState, Things.ThingName FROM Logs
                JOIN (SELECT DeviceID, ThingID, MAX(CreatedAt) AS maxdate FROM Logs group by DeviceID, ThingID) y
                ON y.maxdate = Logs.CreatedAt AND y.DeviceID = Logs.DeviceID AND y.ThingID = Logs.ThingID
                INNER JOIN Things ON Logs.DeviceID = Things.DeviceID AND Logs.ThingID = Things.ThingID
                WHERE Things.ThingType = 'light'
                AND Logs.DeviceID = ?`, [deviceid],
                function(err, results) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results);
                    }
                }
            )
        })
    }
}