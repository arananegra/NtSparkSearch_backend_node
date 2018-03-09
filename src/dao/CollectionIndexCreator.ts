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

    public static createCompoundIndex(collectionReference: Collection, arrayOfIndexesToCreate: Array<string>) {
        try {
            let indexObject = {};
            arrayOfIndexesToCreate.map(value => {
                indexObject[value] = "text";
            });
            collectionReference.createIndex(indexObject)

        } catch (Exception) {
            throw new Exception;
        }
    }

}


