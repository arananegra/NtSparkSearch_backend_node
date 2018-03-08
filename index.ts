//Third-party imports
import "reflect-metadata";
import * as express from "express";
import * as bodyParser from "body-parser";
//Own files imports
import {MainServices} from "./src/rest-api/MainServices";
import {graphqlExpress, graphiqlExpress} from "apollo-server-express"
import {makeExecutableSchema} from "graphql-tools";
import {MongoDBConfigurationDTO} from "./src/domain/MongoDBConfigurationDTO";
import {DbConnectionBS} from "./src/bs/DbConnectionBS";

//Global variables declaration
let app: express.Application = express();

//Global Router Declaration
let router: express.Router = express.Router();

//Handle Json Body
app.use(bodyParser.json());

// Logs directory

const books = [
    {
        title: "Harry Potter and the Sorcerer's stone",
        author: 'J.K. Rowling',
    },
    {
        title: 'Jurassic Park',
        author: 'Michael Crichton',
    },
];

// The GraphQL schema in string form
const typeDefs = `
  type Query { books: [Book] }
  type Book { title: String, author: String }
`;

// The resolvers
const resolvers = {
    Query: {books: () => books},
};

// Put together a schema
const graphQLSchema = makeExecutableSchema({
    typeDefs,
    resolvers,
});


//Enable CORS
app.use(function (req: express.Request, res: express.Response, next: express.NextFunction) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
});

//Url context before services name
app.use('/api', router);

// The GraphQL endpoint
app.use('/graphql',
    bodyParser.json(),
    graphqlExpress(async req => {

        let mongoDbDTO: MongoDBConfigurationDTO = new MongoDBConfigurationDTO();
        mongoDbDTO.clientReference = "localhost";
        mongoDbDTO.port = "27017";
        mongoDbDTO.databaseName = "testDB";

        //TODO sustituir por variables de entorno en produccion

        let connection = await DbConnectionBS.getConnection(mongoDbDTO);

        return {
            schema: graphQLSchema,
            context: {
                databaseConnection: connection,
            },
            // other options here
            debug: true
        };
    })
);

// GraphiQL, a visual editor for queries
app.use('/graphiql', graphiqlExpress({endpointURL: '/graphql'}));

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


