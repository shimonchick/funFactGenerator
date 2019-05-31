const mysql = require('mysql');

module.exports = class Product {
    constructor() {
        this.connection = mysql.createConnection({
            multipleStatements: true,
            host: 'localhost',
            user: 'root',
            password: 'password',
            database: 'test'
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
            this.connection.query(
                `IF NOT EXISTS ( SELECT 1 FROM Users WHERE productId = ${escapedProductId} AND userId = ${escapedUserId} ' )
                    INSERT INTO Likes (productId, userId) VALUES (${escapedProductId}, ${escapedUserId});
                ELSE
                    DELETE FROM Likes where productId = ${escapedProductId} and userId = ${escapedUserId};
                `, function (err, rows, fields) {
                    if (err) reject(err);
                    console.log(rows[0]);
                    resolve();
                })
        })
    }
};

