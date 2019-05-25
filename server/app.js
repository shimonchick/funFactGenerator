const express = require('express');
const expressWinston = require('express-winston');
const bodyParser = require('body-parser');
const winston = require('winston'); // for transports.Console

const productRouter = require('routes/product');

const app = express();
const port = 3000;

const mysql = require('mysql');


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database : 'my_db'
});

app.use(bodyParser.json());

app.use(expressWinston.logger({
    transports: [
        new winston.transports.Console()
    ],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
    )
}));

app.use(expressWinston.errorLogger({
    transports: [
        new winston.transports.Console()
    ],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
    )
}));

app.use('/product', productRouter);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
