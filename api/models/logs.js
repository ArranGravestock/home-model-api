'Use Strict';

var database = require('./database');
var connection = database.Connect();

module.exports = {
    add: (value) => {
        return new Promise((resolve, reject) => {
            connection.query(`INSERT INTO Logs SET ?`, [value],
            function(err) {
                if (err) {
                    console.log(value);
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
            JOIN (SELECT DeviceID, ThingID, MAX(LogID) as LogID, MAX(CreatedAt) AS maxdate FROM Logs group by DeviceID, ThingID) y
            ON y.maxdate = Logs.CreatedAt AND y.DeviceID = Logs.DeviceID AND y.ThingID = Logs.ThingID AND y.LogID = Logs.LogID
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
            LIMIT ?`, [deviceid, parseInt(limit)], 
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

    getAllByType: (deviceid, type) => {
        return new Promise((resolve, reject) => {
            connection.query(
                `SELECT Logs.DeviceID, Logs.ThingID, Logs.ThingState, Things.ThingName FROM Logs
                JOIN (SELECT DeviceID, ThingID, MAX(LogID) as LogID, MAX(CreatedAt) AS maxdate FROM Logs group by DeviceID, ThingID) y
                ON y.maxdate = Logs.CreatedAt AND y.DeviceID = Logs.DeviceID AND y.ThingID = Logs.ThingID AND y.LogID = Logs.LogID
                INNER JOIN Things ON Logs.DeviceID = Things.DeviceID AND Logs.ThingID = Things.ThingID
                WHERE Things.ThingType = ?
                AND Logs.DeviceID = ?`, [type, deviceid],
                function(err, results) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results);
                    }
                }
            )
        })
    },

    getAverageForDate: (deviceid, thingid, date) => {
        return new Promise((resolve, reject) => {
            connection.query(
                `SELECT AVG(ThingState) AS average FROM Logs
                WHERE DATE(CreatedAt) = ?
                AND DeviceID = ?
                AND ThingID = ?`, [date, deviceid, thingid],
                function(err, results) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results);
                    }
                }
            )
        })
    },

    getAverageOverDays: (deviceid, thingid, days) => {
        return new Promise((resolve, reject) => {
            connection.query(
                `SELECT DeviceID, ThingID, ROUND(AVG(ThingState)) AS average FROM Logs
                WHERE DATE(CreatedAt) BETWEEN DATE_SUB(DATE(NOW()), INTERVAL ? DAY) AND DATE(NOW())
                AND DeviceID = ?
                AND ThingID = ?`, [days, deviceid, thingid],
                function(err, results) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results);
                    }
                }
            )
        })
    },

    getAverageForLastDays: (deviceid, thingid, days) => {
        return new Promise((resolve, reject) => {
            connection.query(
                `SELECT DATE(CreatedAt) as dates, ROUND(AVG(ThingState)) AS average FROM Logs
                WHERE DATE(CreatedAt) BETWEEN DATE_SUB(DATE(NOW()), INTERVAL ? DAY) AND DATE(NOW())
                AND DeviceID = ?
                AND ThingID = ?
                GROUP BY DATE(CreatedAt)`, [days, deviceid, thingid],
                function(err, results) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results);
                    }
                }
            )
        })
    },

    getAverageForLastHours: (deviceid, thingid, hours) => {
        return new Promise((resolve, reject) => {
            connection.query(
                `SELECT DATE(CreatedAt) as dates, HOUR(CreatedAt) as hours, ROUND(AVG(ThingState)) AS average FROM Logs
                WHERE DATE(CreatedAt) BETWEEN DATE(DATE_SUB(NOW(), INTERVAL ? HOUR)) AND DATE(NOW())
                AND DeviceID = ?
                AND ThingID = ?
                GROUP BY DATE(CreatedAt), HOUR(CreatedAt)`, [hours, deviceid, thingid],
                function(err, results) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results);
                    }
                }
            )
        })
    },
}