import {Db} from "mongodb"

let MongoClient = require('mongodb').MongoClient;
import * as Q from "q";
import {MongoDBConfigurationDTO} from "../domain/MongoDBConfigurationDTO";

export class MongoDBConnectionPoolDAO {
    private static _instance: any = new MongoDBConnectionPoolDAO();

    private _connectionPool: Db = null;

    public constructor() {
        if (MongoDBConnectionPoolDAO._instance) {
            throw new Error("Error: Instantiation failed: Use MongoDBConnectionPoolDAO.getInstance() instead of new.");
        }
        MongoDBConnectionPoolDAO._instance = this;
    }

    public static getInstance(configurationPool: MongoDBConfigurationDTO): Q.IPromise<MongoDBConnectionPoolDAO> {
        let deferred: Q.Deferred<MongoDBConnectionPoolDAO>;
        deferred = Q.defer<MongoDBConnectionPoolDAO>();

        try {
            if (this._instance._connectionPool == null) {
                this._instance._connectionPool = MongoClient.connect("mongodb://" + configurationPool.clientReference +
                    ":" + configurationPool.port + "/" + configurationPool.databaseName);

                console.log("POOL FIRST INSTANCE");
                deferred.resolve(MongoDBConnectionPoolDAO._instance);
            } else {
                console.log("POOL FROM MEMORY");
                deferred.resolve(MongoDBConnectionPoolDAO._instance);
            }

            return deferred.promise;
        } catch (Exception) {
            throw new Exception;
        }
    }

    public getConnectionPool(): any {
        return this._connectionPool;
    }
}


