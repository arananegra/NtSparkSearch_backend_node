let mongoose = require('mongoose');
let ObjectID = require('mongodb').ObjectID;
mongoose.Promise = require('q').Promise;

let user = {
    a: 'abc',
};

let connPromise = mongoose.createConnection("mongodb://localhost:27017/testDB", {
    useMongoClient: true,
});


connPromise.then((db) => {
    console.log(db);
    db.collection("testCollection").insert(user);
    console.log("successsss!!")
});

connPromise.then((db) => {
    db.close();
});

