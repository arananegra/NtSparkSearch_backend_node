//Third-party imports
import "reflect-metadata";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as jwt from "express-jwt"
//Own files imports
import {MainServices} from "./src/rest-api/MainServices";
import {ServicesRouteConstants} from "./src/constants/ServicesRouteConstants";


//Global variables declaration
let app: express.Application = express();

//Global Router Declaration
let router: express.Router = express.Router();

//Handle Json Body
app.use(bodyParser.json());

//Enable CORS
app.use(function (req: express.Request, res: express.Response, next: express.NextFunction) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
});

// JWT Security middleware
let jwtCheck = jwt({
    secret: "mySecret",
    getToken: (req)  => {
        if (req.headers.token) {
            return req.headers.token;
        } else {
            return null;
        }
    }
}).unless({path: [ServicesRouteConstants.BASE_API + ServicesRouteConstants.REGISTER_SERVICE,
        ServicesRouteConstants.BASE_API + ServicesRouteConstants.LOGIN_SERVICE]});

// Enable the use of the jwtCheck middleware in all of our routes
app.use(jwtCheck);

// Function fallback for Auth errors

app.use(function (err, req, res, next) {
    if (err.constructor.name === 'UnauthorizedError') {
        res.status(401).send(err);
    }
});

//Url context before services name
app.use(ServicesRouteConstants.BASE_API, router);

//Server configuration
let server = app.listen(3000, () => {
    let host: string = server.address().address;
    let port: number = server.address().port;

    console.log(`App Listening at http://${host}:${port}`);
});


//Routes objects instantiation
//let sumService = new MultiplyService(app);
new MainServices(router);

//Export for testing purpose
module.exports = app;


