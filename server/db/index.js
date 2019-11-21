const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 10,
    user: 'root',
    database: 'chat',
    host: 'localhost',
    port: '3306'
});

let chatdb = [];

chatdb.createDB = () => {
    return new Promise((resolve, reject) => {
        pool.query(`CREATE SCHEMA chat;
            CREATE TABLE chat.usuarios (
            id INT NOT NULL,
            user VARCHAR(45) NOT NULL,
            password VARCHAR(45) NOT NULL,
            PRIMARY KEY (id));`, (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
}

chatdb.all = () => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM usuarios`, (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
};

chatdb.one = (user) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT password FROM usuarios WHERE user = ?`,[user], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
};

chatdb.create = (id,user,password) => {
    return new Promise((resolve, reject) => {
        pool.query(`INSERT INTO chat.usuarios (id, user, password) VALUES ('${id}', '${user}', '${password}');`, (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
};

module.exports = chatdb;