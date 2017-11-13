export class MongoDBConfigurationDTO {
    private _client_reference: string;
    private _port: string;
    private _database_name: string;


    public constructor() {
        this._client_reference = null;
        this._port = null;
        this._database_name = null;
    }

    set client_reference(value: string) {
        this._client_reference = value;
    }

    set port(value: string) {
        this._port = value;
    }

    set database_name(value: string) {
        this._database_name = value;
    }


    get client_reference(): string {
        return this._client_reference;
    }

    get port(): string {
        return this._port;
    }

    get database_name(): string {
        return this._database_name;
    }
}