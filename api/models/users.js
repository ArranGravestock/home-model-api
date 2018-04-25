'Use Strict';

var crypto = require('crypto');

var database = require('./database');
var connection = database.Connect();

module.exports = {
    //hashedPass = hashPass("test"); //causes error undefined ???
        //console.log(hashedPass); //undefined??????
    create: (data) => {
        return new Promise((resolve, reject) => {
            if(data.username && data.password && data.email) {
                connection.query(`INSERT INTO Users (UserName, Password, Email)
                VALUES (?, ?, ?)`, [data.username, data.password, data.email],
                function(err, results) {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        resolve(results.insertId);
                    }
                })
            } else {
                reject(false);
            }
        })
    },

    removeAccess: (userid, deviceid) => {
        return new Promise((resolve, reject) => {
            connection.query(`DELETE FROM UserDevices WHERE UserID = ?
            AND DeviceID = ?`, [userid, deviceid],
            function(err, results) {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    resolve(results);
                }
            })
        })
    },

    validateLogin: (data) => {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT Users.UserName, Users.UserID FROM Users
            WHERE Users.UserName = ? AND Users.Password = ?`, [data.username, data.password],
            function(err, results) {
                if (err) {
                    reject(err);
                } else {
                    if (!results.length) {
                        reject(false);
                    } else {
                        resolve(results);
                    }
                }
            })
        })
    },

    validateAdmin: (userid, deviceid) => {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT UserDevices.Admin FROM UserDevices
            WHERE UserDevices.UserID = ? AND UserDevices.DeviceID = ?`, [userid, deviceid],
            function(err, results) {
                if (err) {
                    reject(err);
                } else {
                    if (!results.length) {
                        reject(false);
                    } else {
                        resolve(results);
                    }
                }
            })
        })
    },

    retrieveAuths: (deviceid) => {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT 
            Users.UserName, UserDevices.Admin
        FROM
            UserDevices
                INNER JOIN
            Users ON Users.UserID = UserDevices.UserID
        WHERE
            DeviceID = ?
                AND Admin = 0`, [deviceid],
            function(err, results) {
                if (err) {
                    reject(err);
                } else {
                    if (!results.length) {
                        reject(false);
                    } else {
                        resolve(results);
                    }
                }
            })
        })
    },
    
    registerDevice: (req) => {
        return new Promise((resolve, reject) => {
            connection.query(`INSERT INTO UserDevices (UserID, DeviceID)
            VALUES (?, ?)`, [req.session.userid, req.params.token],
                function(err) {
                    if (err) {
                        reject(err.code)
                    } else {
                        resolve(true);
                    }
                }
            )
        })
    }
}

/*
hashPass = (password) => {
    crypto.pbkdf2('secret', 'salt', 100000, 512, 'sha512', (err, derviedKey) => {
        if (err) throw err;
       
        let hashedpass = derviedKey.toString('hex');
        console.log(hashedpass);
        return hashedpass;
    })
}
*/