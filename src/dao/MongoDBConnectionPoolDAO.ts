import * as mongoose from "mongoose";
import * as Q from "q";
import {MongoDBConfigurationDTO} from "../domain/MongoDBConfigurationDTO";
(<any>mongoose).Promise = require('q').Promise;

export class MongoDBConnectionPoolDAO {
    private static _instance: MongoDBConnectionPoolDAO = new MongoDBConnectionPoolDAO();

    private _connectionPool: any = null;

    public constructor() {
        if (MongoDBConnectionPoolDAO._instance) {
            throw new Error("Error: Instantiation failed: Use MongoDBConnectionPoolDAO.getInstance() instead of new.");
        }
        MongoDBConnectionPoolDAO._instance = this;
    }

    public static getInstance(configurationPool?: MongoDBConfigurationDTO): Q.IPromise<MongoDBConnectionPoolDAO> {
        let deferred: Q.Deferred<MongoDBConnectionPoolDAO>;
        deferred = Q.defer<MongoDBConnectionPoolDAO>();
        //mongoose.Promise = require('q').Promise;


        try {
            if (this._instance._connectionPool == null) {
                this._instance._connectionPool = mongoose.createConnection("mongodb://localhost:27017/testDB", {
                    useMongoClient: true,
                });

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


