'Use Strict';

var Request = require('tedious').Request;
var Connection = require('tedious').Connection;

var database = require('./database');
var connection = database.Connect();

module.exports = {
    returnAll: (deviceid) => {
        return new Promise((resolve, reject) => {
            connection.query(
                `SELECT Logs.DeviceID, Logs.ThingID, Logs.ThingState, Things.ThingName FROM Logs
                JOIN (SELECT DeviceID, ThingID, MAX(CreatedAt) AS maxdate FROM Logs group by DeviceID, ThingID) y
                ON y.maxdate = Logs.CreatedAt AND y.DeviceID = Logs.DeviceID AND y.ThingID = Logs.ThingID
                INNER JOIN Things ON Logs.DeviceID = Things.DeviceID AND Logs.ThingID = Things.ThingID
                WHERE Things.ThingType = 'remote'
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