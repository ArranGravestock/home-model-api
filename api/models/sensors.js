'Use Strict';

var database = require('./database');

var connection = database.Connect();

module.exports = {
    getState: (deviceid, thingid) => {
        return new Promise((resolve, reject) => {
            connection.query(
            `SELECT Logs.DeviceID, Logs.ThingID, Logs.ThingState, Things.ThingName FROM Logs
            JOIN (SELECT DeviceID, ThingID, MAX(CreatedAt) AS maxdate FROM Logs group by DeviceID, ThingID) y
            ON y.maxdate = Logs.CreatedAt AND y.DeviceID = Logs.DeviceID AND y.ThingID = Logs.ThingID
            INNER JOIN Things ON Logs.DeviceID = Things.DeviceID AND Logs.ThingID = Things.ThingID
            WHERE Things.ThingType = 'sensor'
            AND Logs.DeviceID = ?
            AND Logs.ThingID = ?`, [deviceid, thingid],
            function(err, results) {
                if (err) {
                    reject(err)
                } else {
                    if(!results.length) {
                        reject("no results found");
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
                `SELECT Logs.DeviceID, Logs.ThingID, Logs.ThingState, Things.ThingName FROM Logs
                JOIN (SELECT DeviceID, ThingID, MAX(CreatedAt) AS maxdate FROM Logs group by DeviceID, ThingID) y
                ON y.maxdate = Logs.CreatedAt AND y.DeviceID = Logs.DeviceID AND y.ThingID = Logs.ThingID
                INNER JOIN Things ON Logs.DeviceID = Things.DeviceID AND Logs.ThingID = Things.ThingID
                WHERE Things.ThingType = 'sensor'
                AND Logs.DeviceID = ?`, [deviceid],
                function(err, results) {
                    if (err) {
                        console.log(err)
                        reject(err);
                    } else {
                        resolve(results);
                    }
                }
            )
        })
    }
}