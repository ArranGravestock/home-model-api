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
    }
}