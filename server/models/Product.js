const mysql = require('mysql');

module.exports = class Product {
    constructor() {
        this.connection = mysql.createConnection({
            multipleStatements: true,
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'nodejs'
        });
        this.connection.connect();

        this.connection.query('CREATE TABLE IF NOT EXISTS `Products`(' +
            '`id` INTEGER NOT NULL auto_increment,' +
            '`name` VARCHAR(64) UNIQUE,' +
            '`description` VARCHAR(255),' +
            '`price` FLOAT NOT NULL,' +
            '`sellerId` INTEGER NOT NULL,' +
            '`createdAt` DATETIME NOT NULL,' +
            '`updatedAt` DATETIME NOT NULL,' +
            'PRIMARY KEY (`id`),' +
            'FOREIGN KEY(sellerId) REFERENCES Users(id))');

    }

    get(id){
        return new Promise(((resolve) => {
            this.connection.query('SELECT * FROM Products WHERE id = ?', id, function (err, rows, fields) {
                if (err) throw err;
                resolve(rows[0] || null);
            })

        }));
    }
    getAll(query = null) {
        return new Promise(((resolve) => {
            if (query && query.name) {
                this.connection.query('SELECT * FROM Products WHERE name = ?', query.name, function (err, rows, fields) {
                    if (err) throw err;
                    resolve(rows || null);
                })
            } else if (query && query.id) {
                this.connection.query('SELECT * FROM Products WHERE id = ?', query.id, function (err, rows, fields) {
                    if (err) throw err;
                    resolve(rows || null);
                })
            } else if (query && query.price) {
                this.connection.query('SELECT * FROM Products WHERE price = ?', query.price, function (err, rows, fields) {
                    if (err) throw err;
                    resolve(rows || null);
                })
            } else if (query && query.description) {
                this.connection.query('SELECT * FROM Products WHERE description LIKE %?%', query.description,
                    function (err, rows, fields) {
                        if (err) throw err;
                        resolve(rows || null);
                });

            } else {
                this.connection.query('SELECT * FROM Products ',
                    function (err, rows, fields) {
                        if (err) throw err;
                        resolve(rows || null);
                    });

            }
        }));
    }

    create(sellerId, name, price, description) {

        return new Promise(((resolve, reject) => {
            price = parseInt(price.trim());
            name = name.trim();
            description = description.trim();
            const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
            this.connection.query('INSERT INTO Products(sellerId, name, price, description, createdAt, updatedAt) ' +
                'VALUES(?, ?, ?, ?, ?, ?);' +
                'SELECT LAST_INSERT_ID();',
                [sellerId, name, price, description, date, date],
                function (err, results, fields) {
                    if (err) reject(err);

                    resolve(results[1][0]["LAST_INSERT_ID()"]);
                })
        }));
    }

    update(id, description, name, price) {
        return new Promise(((resolve, reject) => {
            const updatedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
            this.connection.query('UPDATE Products SET name = ?, price = ?, description = ?, updatedAt = ? WHERE id = ?',
                [name, price, description, id],
                function (err, results, fields) {
                    if (err) reject(err);
                    resolve();
                })
        }))
    }
    delete(id){
        return new Promise((resolve, reject)=>{
            this.connection.query('DELETE FROM Products WHERE id = ?', id, function(err, results, fields){
                if(err) reject(err);
                resolve();
            })
        })
    }


};
