const mysql = require('mysql');

module.exports = class User {

    constructor() {
        this.connection = mysql.createConnection({
            multipleStatements: true,
            host: 'localhost',
            user: 'root',
            password: 'password',
            database: 'test'
        });
        this.connection.connect();

        this.connection.query('CREATE TABLE IF NOT EXISTS `Users`(`id` INTEGER NOT NULL auto_increment,' +
            ' `name` VARCHAR(255) UNIQUE, `password` VARCHAR(255), `createdAt` DATETIME NOT NULL,' +
            '`updatedAt` DATETIME NOT NULL, PRIMARY KEY (`id`))');

    }

    get(query) {
        return new Promise(((resolve) => {
            if(query.name){
                this.connection.query('SELECT * FROM Users WHERE name = ?', query.name, function (err, rows, fields) {
                    if (err) throw err;
                    resolve(rows[0] || null);
                })
            }
            else if(query.id){
                this.connection.query('SELECT * FROM Users WHERE id = ?', query.id, function (err, rows, fields) {
                    if (err) throw err;
                    resolve(rows[0] || null);
                })
            }
            else{
                resolve(null);
            }
        }));
    }

    create(name, password) {

        return new Promise(((resolve, reject) => {
            const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
            this.connection.query('INSERT INTO Users(name, password, createdAt, updatedAt) VALUES(?, ?, ?, ?)',
                [name, password, date, date],
                function (err, results, fields) {
                    if (err) reject(err);

                    resolve({name: name, password: password});
                })
        }));
    }
    update(oldName, newName, newPassword){
        return new Promise(((resolve, reject) => {
            if(newName === null){
                newName = oldName;
            }
            const updatedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
            this.connection.query('UPDATE Users SET name = ?, password = ? updatedAt = ? WHERE name = ?',
                [newName, newPassword, updatedAt, oldName],
                function(err, results, fields){
                    if(err) reject(err);
                    resolve();
                })
        }))
    }
    delete(name){
        return new Promise((resolve, reject)=>{
            this.connection.query('DELETE FROM Users WHERE name = ?', name, function(err, results, fields){
                if(err) reject(err);
                resolve();
            })
        })
    }
};
