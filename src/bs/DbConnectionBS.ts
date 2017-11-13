import * as Q from "q";
import {MongoDBConfigurationDTO} from "../domain/MongoDBConfigurationDTO";
import {MongoDBConnectionPoolDAO} from "../dao/MongoDBConnectionPoolDAO";

export class DbConnectionBS {

    public constructor() {

    }

    public static getConnection(connectionConfiguration: MongoDBConfigurationDTO): Q.IPromise<any> {
        let deferred: Q.Deferred<any>;

        try {
            deferred = Q.defer<any>();
            MongoDBConnectionPoolDAO.getInstance(connectionConfiguration)
                .then((daoInstance) => {
                    deferred.resolve(daoInstance.getConnectionPool());
                });

            return deferred.promise;
        } catch (Exception) {
            throw new Exception;
        }
    }

    public static closeConnection(connectionReference: any) {
        if (connectionReference) {
            connectionReference.close();
            console.log("CONNECTION CLOSED!");
        }
    }
}