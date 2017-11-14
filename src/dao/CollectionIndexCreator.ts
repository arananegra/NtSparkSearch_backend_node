import {Collection} from "mongodb"

let MongoClientInstance = require('mongodb').MongoClient;

export class CollectionIndexCreator {

    public static createIndex(collectionReference: Collection, attributeOfMongo: string) {
        try {
            collectionReference.createIndex({[attributeOfMongo]: "text"})

        } catch (Exception) {
            throw new Exception;
        }
    }

}


