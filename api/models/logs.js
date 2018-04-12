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
            connection.query(`SELECT Logs.DeviceID, Logs.ThingID, Logs.ThingState, Things.ThingName FROM Logs
            JOIN (SELECT DeviceID, ThingID, MAX(CreatedAt) AS maxdate FROM Logs group by DeviceID, ThingID) y
            ON y.maxdate = Logs.CreatedAt AND y.DeviceID = Logs.DeviceID AND y.ThingID = Logs.ThingID
            INNER JOIN Things ON Logs.DeviceID = Things.DeviceID AND Logs.ThingID = Things.ThingID
            WHERE Logs.DeviceID = ?
            AND Logs.ThingID = ?`, [deviceid, thingid], 
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
                    reject(err)
                } else {
                    resolve(results);
                }
            }) 
        })
    },
    countDevices: (deviceid) => {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT COUNT(DeviceID) as TotalCount FROM home_model.Logs
            WHERE DeviceID = ?
            `, [deviceid], 
            function(err, results) {
                if (err) {
                    reject(err)
                } else {
                    resolve(results);
                }
            }) 
        })
    },
    countThing: (deviceid, thingid) => {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT COUNT(ThingID) FROM home_model.Logs
            WHERE DeviceID = ?
            AND ThingID = ?
            `, [deviceid, thingid], 
            function(err, results) {
                if (err) {
                    reject(err)
                } else {
                    resolve(results);
                }
            }) 
        })
    },
    countAllThings: (deviceid) => {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT Logs.ThingID, Things.ThingName, COUNT(Logs.ThingID) as TotalCount FROM Logs
            INNER JOIN Things on Things.ThingID = Logs.ThingID
            AND Things.DeviceID = Logs.DeviceID
            WHERE Logs.ThingID IN (Logs.ThingID)
            AND Logs.DeviceID = ?
            GROUP BY Logs.DeviceID, Logs.ThingID
            `, [deviceid], 
            function(err, results) {
                if (err) {
                    reject(err)
                } else {
                    resolve(results);
                }
            }) 
        })
    },
}