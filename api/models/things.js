'Use Strict';

var database = require('./database');
var connection = database.Connect();

module.exports = {
    countByCategory: (deviceid, category) => {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT COUNT(ThingID) as TotalCount FROM Things
            WHERE DeviceID = ?
            AND ThingType = ?`, [deviceid, category], 
            function(err, results) {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            })
        })
    },
    getState: (deviceid, thingid, type) => {
        return new Promise((resolve, reject) => {
            connection.query(
            `SELECT Logs.DeviceID, Logs.ThingID, Logs.ThingState, Things.ThingName FROM Logs
            JOIN (SELECT DeviceID, ThingID, MAX(CreatedAt) AS maxdate FROM Logs group by DeviceID, ThingID) y
            ON y.maxdate = Logs.CreatedAt AND y.DeviceID = Logs.DeviceID AND y.ThingID = Logs.ThingID
            INNER JOIN Things ON Logs.DeviceID = Things.DeviceID AND Logs.ThingID = Things.ThingID
            WHERE Logs.DeviceID = ?
            AND Logs.ThingID = ?
            AND Things.ThingType = ?`, [deviceid, thingid, type],
            function(err, results) {
                if (err) {
                    console.log(err);
                    console.log("ERROR");
                    reject(err)
                } else {
                    if(!results.length) {
                        console.log("ERROR2");
                        reject("no results found");
                    } else {
                        resolve(results);
                    }
                }
            })
        })
    },
}