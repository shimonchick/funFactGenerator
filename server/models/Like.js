const mysql = require('mysql');
const config = require('../config');
module.exports = class Product {
    constructor() {
        this.connection = mysql.createConnection({
            multipleStatements: true,
            ...config.mysqlCredentials
        });
        this.connection.connect();

        this.connection.query(
            `CREATE TABLE IF NOT EXISTS Likes ( 
            productId INTEGER NOT NULL auto_increment,
            userId INTEGER NOT NULL,
            FOREIGN KEY(userId) REFERENCES Users(id),
            FOREIGN KEY(productId) REFERENCES Products(id) )`);

    }

    toggle(userId, productId) {
        return new Promise((resolve, reject) => {
            const escapedProductId = this.connection.escape(productId);
            const escapedUserId = this.connection.escape(userId);
            const insertLike = 'INSERT INTO Likes (productId, userId) VALUES (?, ?)';
            const removeLike = 'DELETE FROM Likes where productId = ? and userId = ?';
            const condition = 'SELECT * FROM Likes WHERE productId = ? AND userId = ?';
            console.log(productId);
            console.log(userId);
            this.connection.query(condition,
                [productId, userId],
                (err, rows, fields) => {
                if (err) reject(err);
                console.log('CONDITION: ');
                console.log(JSON.stringify(rows));
                const resultCondition = rows[0];
                this.connection.query(
                    resultCondition ? removeLike : insertLike,
                    [productId, userId],
                    function (err, rows, fields) {
                        if (err) reject(err);
                        console.log(rows);
                        resolve();
                    })
            });

        })
    }
};

