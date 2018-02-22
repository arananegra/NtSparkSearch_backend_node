import {Db} from "mongodb"

let MongoClient = require('mongodb').MongoClient;
import {MongoDBConfigurationDTO} from "../domain/MongoDBConfigurationDTO";

export class MongoDBConnectionPoolDAO {
    private static _instance: MongoDBConnectionPoolDAO = new MongoDBConnectionPoolDAO();
    private _connectionPool: Db = null;

    public constructor() {
        if (MongoDBConnectionPoolDAO._instance) {
            throw new Error("Error: Instantiation failed: Use MongoDBConnectionPoolDAO.getInstance() instead of new.");
        }
        MongoDBConnectionPoolDAO._instance = this;
    }

    public static getInstance(configurationPool: MongoDBConfigurationDTO): Promise<MongoDBConnectionPoolDAO> {
        try {

            return new Promise<MongoDBConnectionPoolDAO>(resolve => {
                if (this._instance._connectionPool == null) {
                    this._instance._connectionPool = MongoClient.connect("mongodb://" + configurationPool.clientReference +
                        ":" + configurationPool.port + "/" + configurationPool.databaseName);

                    console.log("POOL FIRST INSTANCE");
                    resolve(MongoDBConnectionPoolDAO._instance);
                } else {
                    console.log("POOL FROM MEMORY");
                    resolve(MongoDBConnectionPoolDAO._instance);
                }
            });

        } catch (Exception) {
            throw new Exception;
        }
    }


    public getConnectionPool(): any {
        return this._connectionPool;
    }
}

