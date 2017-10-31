export class MongoDBConfigurationDTO {
    public _client_reference: string;
    public _database_name: string;
    public _collection_name: string;


    public constructor() {
        this._client_reference = null;
        this._database_name = null;
        this._collection_name = null;
    }
}