'Use Strict';

var database = require('./database');

var connection = database.Connect();

module.exports = {
    SensorState: (req) => {
        return new Promise((resolve, reject) => {
            connection.query(
            `SELECT Sensors.SensorID, Sensors.SensorName, Sensors.SensorState
            FROM Devices
            RIGHT JOIN Rooms on Devices.DeviceID = Rooms.DeviceID
            RIGHT JOIN Sensors on Rooms.RoomID = Sensors.RoomID
            WHERE Devices.DeviceID = ? AND Rooms.RoomID = ? AND Sensors.SensorID = ?`, [req.deviceid, req.roomid, req.sensorid],
            function(err, results) {
                if (err) {
                    console.log(err);
                    reject(err)
                } else {
                    if(!results.length) {
                        reject("no results found");
                    } else {
                        //console.log(results);
                        resolve(results);
                    }
                }
            })
        })
    },
    Update: (req) => {
        return new Promise((resolve, reject) => {
            connection.query(
                `UPDATE Sensors
                INNER JOIN Rooms ON Sensors.RoomID = Rooms.RoomID
                INNER JOIN Devices ON Devices.DeviceID = Rooms.DeviceID
                SET Sensors.SensorState = ?
                WHERE Devices.DeviceID = ? AND Rooms.RoomID = '1' AND Sensors.SensorID = ?
                `, [req.sensorstate, req.deviceid, req.sensorid],
                function (err) {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        resolve("success");
                    }
                }
            )
        })
    }
}