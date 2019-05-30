const mysql = require('mysql');

module.exports = class Product {
    constructor() {
        this.connection = mysql.createConnection({
            multipleStatements: true,
            host: 'localhost',
            user: 'root',
            password: 'password',
            database: 'nodejs'
        });
        this.connection.connect();

        this.connection.query('CREATE TABLE IF NOT EXISTS `Likes`(' +
            '`productId` INTEGER NOT NULL auto_increment,' +
            '`userId` INTEGER NOT NULL,' +
            'FOREIGN KEY(userId) REFERENCES Users(id)' +
            'FOREIGN KEY(productId) REFERENCES Product(id) )');

    }

    toggle(userId, productId) {
        return new Promise((resolve, reject) => {
            this.connection.query(
                `IF NOT EXISTS ( SELECT 1 FROM Users WHERE productId = ? AND userId = ? ' )
                    INSERT INTO Likes (productId, userId) VALUES (?, ?);
                ELSE
                    DELETE FROM Likes where productId = ? and userId = ?;
                `
            [productId, userId], function(err, rows, fields) {
                if (err) reject(err);
                // resolve(rows[0] || null);
            })
        })
    }

    get(id) {
        return new Promise(((resolve, reject) => {
            this.connection.query('SELECT * FROM Products WHERE id = ?', id, function (err, rows, fields) {
                if (err) reject(err);
                resolve(rows[0] || null);
            })

        }));
    }

    getAll(query) {
        return new Promise((resolve, reject) => {
            let sql = 'SELECT * FROM Products';
            console.log("query: " + query);
            if (query) {
                const {name, description, price, page, limit} = query;
                console.log("page: " + page + "limit: " + limit);
                if (name) {
                    sql += ' WHERE name = ' + this.connection.escape(name);
                } else if (description) {
                    sql += ' WHERE description LIKE %' + this.connection.escape(description) + '%';
                } else if (price) {
                    sql += ' WHERE price = ' + this.connection.escape(price);
                }

                if (page && limit) {
                    const limitNum = parseInt(limit.trim());
                    const pageNum = parseInt(page.trim());
                    sql += ` LIMIT ${pageNum * limitNum},${limitNum}` ;
                }
            }
            const mysqlQuery = this.connection.query(sql, function (err, rows, fields) {
                if (err) reject(err);
                resolve(rows || null);
            });
            console.log(mysqlQuery.sql);
        });
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

    update({id, description, name, price}) {
        return new Promise(((resolve, reject) => {
            const updatedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
            this.connection.query('UPDATE Products SET name = ?, price = ?, description = ?, updatedAt = ? WHERE id = ?',
                [name, price, description, updatedAt, id],
                function (err, results, fields) {
                    if (err) reject(err);
                    resolve();
                })
        }))
    }

    delete(id) {
        return new Promise((resolve, reject) => {
            this.connection.query('DELETE FROM Products WHERE id = ?', id, function (err, results, fields) {
                if (err) reject(err);
                resolve();
            })
        })
    }


};

