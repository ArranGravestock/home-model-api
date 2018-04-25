'Use Strict';

var bcrypt = require('bcrypt');
const saltRounds = 10;

var database = require('./database');
var connection = database.Connect();

module.exports = {
    //hashedPass = hashPass("test"); //causes error undefined ???
        //console.log(hashedPass); //undefined??????
    create: (data) => {
        return new Promise((resolve, reject) => {
            if(data.username && data.password && data.email) {
                var hash = bcrypt.hashSync(data.password, saltRounds);

                connection.query(`INSERT INTO Users (UserName, Password, Email)
                VALUES (?, ?, ?)`, [data.username, hash, data.email],
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


            

            connection.query(`SELECT Users.UserName, Users.UserID, Users.Password FROM Users
            WHERE Users.UserName = ?`, [data.username],
            function(err, results) {
                if (err) {
                    reject(err);
                } else {
                    var match = bcrypt.compareSync(data.password, results[0].Password);

                    if (match) {
                        var res = [{UserName: results[0].UserName, UserID: results[0].UserID}]
                        resolve(res);
                    } else {
                        reject(false);
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