const mysql = require('mysql');
const config = require('../config');
module.exports = class Product {
    constructor() {
        this.connection = mysql.createConnection({
            multipleStatements: true,
            ...config.mysqlCredentials
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


    get(id, userId) {
        return new Promise(((resolve, reject) => {
            let sql = ` select Products.name,
                               Products.id,
                               Products.price,
                               Products.description,
                               count(Likes.productId) as likes,
                               exists(select *
                                      from Likes
                                      where Likes.productId = Products.id
                                        and Likes.userId = ?) as liked
                        from Likes
                                 right join Products on Products.id = Likes.productId
                                 left join Users on Likes.userId = Users.id
                        where Products.id = ?
                        group by Products.id`;
            // const sql = `
            // select Products.name, Products.id, Products.price, Products.description, count(Likes.productId) as likes
            //             from Likes
            //             right join Products on Products.id = Likes.productId
            //             WHERE id = ?
            //             group by Products.id
            // `;
            this.connection.query(sql, [userId, id], function (err, rows, fields) {
                if (err) reject(err);
                console.log('!!!!!!!!!!!!!!!!!')
                console.log(rows);
                resolve(rows[0] || null);
            })

        }));
    }

    getAll(query, userId) {
        return new Promise((resolve, reject) => {
            let sql = ` select Products.name,
                               Products.id,
                               Products.price,
                               Products.description,
                               count(Likes.productId) as likes,
                               exists(select *
                                      from Likes
                                      where Likes.productId = Products.id
                                        and Likes.userId = ?) as liked
                        from Likes
                                 right join Products on Products.id = Likes.productId
                                 left join Users on Likes.userId = Users.id
                        group by Products.id`;
            console.log("query: " + query);
            if (query) {
                const {name, description, price, page, limit} = query;
                console.log("page: " + page + "limit: " + limit);
                // if (name) {
                //     sql += ' WHERE name = ' + this.connection.escape(name);
                // } else if (description) {
                //     sql += ' WHERE description LIKE %' + this.connection.escape(description) + '%';
                // } else if (price) {
                //     sql += ' WHERE price = ' + this.connection.escape(price);
                // }

                if (page && limit) {
                    const limitNum = parseInt(limit.trim());
                    const pageNum = parseInt(page.trim());
                    sql += ` LIMIT ${pageNum * limitNum},${limitNum}`;
                }
            }
            const mysqlQuery = this.connection.query(sql, [userId], function (err, rows, fields) {
                if (err) reject(err);
                // rows.map ((product) => {
                //     return product.liked =
                // })
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
