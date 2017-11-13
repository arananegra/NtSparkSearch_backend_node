import {MongoClient, Db} from "mongodb"

let MongoClientInstance = require('mongodb').MongoClient;

export class CollectionIndexCreator {

    public static createIndex(connectionReference: Db, attributeOfMongo: string, collectioName: string) {
        try {
            connectionReference.collection(collectioName).createIndex({[attributeOfMongo]: "text"})

        } catch (Exception) {
            throw new Exception;
        }
    }

}


