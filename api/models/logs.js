'Use Strict';

var database = require('./database');
var connection = database.Connect();

module.exports = {
    add: (values) => {
        return new Promise((resolve, reject) => {
            connection.query(`INSERT INTO Logs (DeviceID, ThingID, ThingState) VALUES ${values}`, 
            function(err) {
                if (err) {
                    console.log(err);
                    reject(err)
                } else {
                    resolve(true);
                }
            }) 
        })
    },
    getBetween: (deviceid, startdate, enddate) => {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT * FROM Logs
            WHERE DeviceID = ?
            AND (CreatedAT BETWEEN ? AND ?)`, [deviceid, startdate, enddate], 
            function(err, results) {
                if (err) {
                    console.log(err);
                    reject(err)
                } else {
                    resolve(results);
                }
            }) 
        })
    },
    getAll: (deviceid) => {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT * FROM Logs
            WHERE DeviceID = ?`, [deviceid], 
            function(err, results) {
                if (err) {
                    console.log(err);
                    reject(err)
                } else {
                    resolve(results);
                }
            }) 
        })
    },
    getLatest: (deviceid, thingid) => {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT LogID, ThingState, CreatedAt, Things.ThingName FROM Logs 
            INNER JOIN Things ON Things.DeviceID = Logs.DeviceID AND Things.ThingID = Logs.ThingID
            WHERE Logs.DeviceID = ?
            AND Logs.ThingID = ?
            AND CreatedAt = (
                SELECT MAX(CreatedAt) 
                FROM Logs
            );`, [deviceid, thingid], 
            function(err, results) {
                if (err) {
                    console.log(err);
                    reject(err)
                } else {
                    resolve(results);
                }
            }) 
        })
    },
    getTop: (deviceid, limit) => {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT Logs.LogID, Logs.CreatedAt, Logs.ThingState, Things.ThingName, Things.ThingType FROM Logs
            INNER JOIN Things on Things.DeviceID = Logs.DeviceID AND Things.ThingID = Logs.ThingID
            WHERE Logs.DeviceID = ?
            ORDER BY CreatedAt DESC
            LIMIT ${limit}`, [deviceid], 
            function(err, results) {
                if (err) {
                    console.log(err);
                    reject(err)
                } else {
                    resolve(results);
                }
            }) 
        })
    }
}