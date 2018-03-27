'Use Strict';

var database = require('./database');
var connection = database.Connect();

module.exports = {
    getDevices: (session) => {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT Devices.DeviceID, Devices.DeviceName FROM Devices
            RIGHT JOIN UserDevices ON Devices.deviceID = UserDevices.DeviceID
            WHERE UserDevices.UserID = ?`, [session.userid], 
            function(err, results) {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    if (!results.length) {
                        reject('Could not find any devices!');
                    } else {
                        resolve(results);
                    }
                }
            })
        });
    },

    getDeviceRooms: (req) => {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT Rooms.RoomName
            FROM Rooms
            RIGHT JOIN Devices on Devices.DeviceID = Rooms.DeviceID
            WHERE Devices.DeviceID = ?`, [req.deviceid], 
            function(err, results) {
                if (err) {
                    console.log(err);
                    reject(err)
                } else {
                    if(!results.length) {
                        reject(false);
                    } else {
                        resolve(results);
                    }
                }
            }) 
        })
    }
}