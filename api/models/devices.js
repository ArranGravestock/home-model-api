'Use Strict';

var database = require('./database');
var connection = database.Connect();

module.exports = {
    getNames: (session) => {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT Devices.DeviceID, Devices.DeviceName FROM Devices
            INNER JOIN UserDevices ON Devices.deviceID = UserDevices.DeviceID
            WHERE UserDevices.UserID = ?`, [session.userid], 
            function(err, results) {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    if (!results.length) {
                        resolve("no results");
                    } else {
                        resolve(results);
                    }
                }
            })
        });
    }
}