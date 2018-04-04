export class MongoDBConfigurationDTO {
    private _clientReference: string;
    private _port: string;
    private _databaseName: string;


    public constructor() {
        this._clientReference = null;
        this._port = null;
        this._databaseName = null;
    }

    set clientReference(value: string) {
        this._clientReference = value;
    }

    set port(value: string) {
        this._port = value;
    }

    set databaseName(value: string) {
        this._databaseName = value;
    }


    get clientReference(): string {
        return this._clientReference;
    }

    get port(): string {
        return this._port;
    }

    get databaseName(): string {
        return this._databaseName;
    }
}