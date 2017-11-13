let MongoClient = require('mongodb').MongoClient
    , assert = require('assert');


let url = 'mongodb://localhost:27017/testDB';

let connection = MongoClient.connect(url);

connection.then((db) => {
    db.collection('parkme_parkingLots').insertMany([
        {a: 1}, {a: 2}, {a: 3}
    ]);
    console.log("Doneee");
});
connection.then((db) => {
    db.close();
});
