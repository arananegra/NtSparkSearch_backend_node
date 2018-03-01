//Third-party imports
import "reflect-metadata";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cluster from 'cluster';
import {cpus} from 'os';
//Own files imports
import {MainServices} from "./src/rest-api/MainServices";

const numCPUs = cpus().length;

if (cluster.isMaster) {
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    cluster.on("listening", function (worker) {
        console.log("Cluster %d connected", worker.process.pid);
    });
    cluster.on("disconnect", function (worker) {
        console.log("Cluster %d disconnected", worker.process.pid);
    });
    cluster.on("exit", function (worker) {
        console.log("Cluster %d is dead", worker.process.pid);
        // Ensuring a new cluster will start if an old one dies
        cluster.fork();
    });
} else {
    //Global variables declaration
    let app: express.Application = express();

//Global Router Declaration
    let router: express.Router = express.Router();

//Handle Json Body
    app.use(bodyParser.json());

// Logs directory

//Enable CORS
    app.use(function (req: express.Request, res: express.Response, next: express.NextFunction) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "*");
        res.header("Access-Control-Allow-Headers", "*");
        next();
    });

//Url context before services name
    app.use('/api', router);

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
}

