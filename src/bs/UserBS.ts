import {Db} from "mongodb";
import {UserDAO} from "../domain/UserDAO";
import {UserDTO} from "../domain/UserDTO";

export class UserBS {
    private _collectionNameToConnect: string;
    private _userDAO: UserDAO;
    private _connectionReference: Db;

    public constructor(collectionNameToConnect, connectionReference) {
        this._collectionNameToConnect = collectionNameToConnect;
        this._userDAO = new UserDAO(collectionNameToConnect);
        this._connectionReference = connectionReference;
    }

    public async registerNewUser(userToInsert: UserDTO): Promise<void> {
        try {
            return this._userDAO.registerNewUser(this._connectionReference, userToInsert);
        } catch (Exception) {
            throw Exception;
        }
    }

    public async loginUser(userToVerify: UserDTO): Promise<UserDTO> {
        try {
            return this._userDAO.loginUser(this._connectionReference, userToVerify)
        } catch (Exception) {
            throw Exception;
        }
    }
}