const express = require('express');
const expressWinston = require('express-winston');
const bodyParser = require('body-parser');
const winston = require('winston'); // for transports.Console
const passport = require('passport');
const passportJWT = require('passport-jwt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const User = require('./models/User');
const Like = require('./models/Like');

const user = new User();

const app = express();
const port = 3000;

const config = require('./config');

// ExtractJwt to help extract the token
let ExtractJwt = passportJWT.ExtractJwt;
// JwtStrategy which is the strategy for the authentication
let JwtStrategy = passportJWT.Strategy;
let jwtOptions = {
    secretOrKey: config.secretOrKey,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    passReqToCallback: true,
};

let strategy = new JwtStrategy(jwtOptions, function (req, jwt_payload, next) {
    console.log('payload received', jwt_payload);
    user.get({id: jwt_payload.id})
        .catch(err =>{
            console.log(err);
            next(null, false);
        })
        .then(currentUser => {
            req.user = currentUser;
            next(null, currentUser);
        });
});

// use the strategy
passport.use(strategy);


app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200','always');

    // res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');


    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');

    // Request headers you wish to allow
    // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(passport.initialize());

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

app.get('/protected', passport.authenticate('jwt', { session: false }), function(req, res) {
    console.log(req.user);
    res.json({usr: req.user, msg: 'Congrats! You are seeing this because you are authorized'});
});

// register route
app.post('/register', function (req, res, next) {
    const {name, password} = req.body;
    user.create(name, password)
        .then(user =>
            res.status(201).json({user, msg: 'account created successfully'})
        )
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })
});

app.post('/login', async function (req, res) {
    const {name, password} = req.body;
    console.log("name: " + name +  "password: " + password);
    if (name && password) {
        // we getAll the currentUser with the name and save the resolved promise
        //returned
        let currentUser = await user.get({name: name});
        if (currentUser == null) {
            res.status(401).json({msg: 'No such currentUser found', user: currentUser});
        }
        if (currentUser.password === password) {
            // from now on we’ll identify the currentUser by the id and the id is
// the only personalized value that goes into our token
            let payload = {id: currentUser.id};
            let token = jwt.sign(payload, jwtOptions.secretOrKey);
            res.json({msg: 'ok', token: token});
        } else {
            res.status(401).json({msg: 'Password is incorrect'});
        }
    }
});

const productController = require('./controllers/product');

app.get('/products', productController.readAll);

app.get('/products/:id', productController.read);
app.post('/products', /*passport.authenticate("jwt", {session: false}), */productController.create);
app.put('/products', /*passport.authenticate("jwt", {session: false}), */productController.update);
app.delete('/products/:id', /*passport.authenticate("jwt", {session: false}), */productController.delete);
app.post('products/:id/like', productController.like)

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
