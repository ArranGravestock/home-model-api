'Use Strict';

var database = require('./database');

var connection = database.Connect();

module.exports = {
    getState: (deviceid, thingid) => {
        return new Promise((resolve, reject) => {
            connection.query(
            `SELECT Things.ThingID, ThingState, Things.ThingName FROM Logs 
            INNER JOIN Things ON Things.DeviceID = Logs.DeviceID AND Things.ThingID = Logs.ThingID
            WHERE Logs.DeviceID = ?
            AND Things.ThingID = ?
            AND CreatedAt = (
                SELECT MAX(CreatedAt) 
                FROM Logs
            )`, [deviceid, thingid],
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
                `SELECT Things.ThingID, Things.ThingName, ThingState FROM Logs 
                INNER JOIN Things ON Things.DeviceID = Logs.DeviceID AND Things.ThingID = Logs.ThingID
                WHERE Logs.DeviceID = ?
                AND Things.ThingType = 'sensor'
                AND CreatedAt = (
                    SELECT MAX(CreatedAt) 
                    FROM Logs
                )`, [deviceid],
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