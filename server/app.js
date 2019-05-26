const express = require('express');
const expressWinston = require('express-winston');
const bodyParser = require('body-parser');
const winston = require('winston'); // for transports.Console
const passport = require('passport');
const passportJWT = require('passport-jwt');
const jwt = require('jsonwebtoken');

const User = require('./models/User');
const user = new User();

const productRouter = require('./routes/product');
const app = express();
const port = 3000;

// ExtractJwt to help extract the token
let ExtractJwt = passportJWT.ExtractJwt;
// JwtStrategy which is the strategy for the authentication
let JwtStrategy = passportJWT.Strategy;
let jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
//TODO : get the secretOrKey from environment variable
jwtOptions.secretOrKey = 'A+F9kTyWIOqWUcf8CuTOcu5GicVun9y4qYrgooTbYtHWJac1J8hCmC4PHzyER7rsX9/hv4mL7uBzJ+jwN3rL6A==';

let strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
    console.log('payload received', jwt_payload);
    let user = user.get({id: jwt_payload.id});
    if (user) {
        next(null, user);
    } else {
        next(null, false);
    }
});

// use the strategy
passport.use(strategy);


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


app.use('/product', productRouter);

app.get('/protected', passport.authenticate('jwt', { session: false }), function(req, res) {
    res.json({ msg: 'Congrats! You are seeing this because you are authorized'});
});

// register route
app.post('/register', function (req, res, next) {
    const {name, password} = req.body;
    user.create(name, password)
        .then(user =>
            res.json({user, msg: 'account created successfully'})
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
        // we get the currentUser with the name and save the resolved promise
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

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
