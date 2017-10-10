//Third-party imports
import "reflect-metadata";
import * as express from "express";
import * as bodyParser from "body-parser";

//Own files imports
import {MainServices} from "./src/rest-api/MainServices";

//Global variables declaration
let app = express();

//Global Router Declaration
let router = express.Router();

//Handle Json Body
app.use(bodyParser.json());

// Logs directory

//Enable CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
});

//Url context before services name
app.use('/api', router);

//Server configuration
let server = app.listen(3000, () => {
    let host:string = server.address().address;
    let port:number = server.address().port;

    console.log(`App Listening at http://${host}:${port}`);
});


//Routes objects instantiation
//let sumService = new MultiplyService(app);
new MainServices(router);

//Export for testing purpose
module.exports = app;