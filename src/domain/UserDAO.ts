import {hash, compare} from "bcrypt"
import {Collection, Db} from "mongodb";
import {GeneDTO} from "./GeneDTO";
import {UserDTO} from "./UserDTO";
import {CollectionIndexCreator} from "../dao/CollectionIndexCreator";
import {DatabaseConstants} from "../constants/DatabaseConstants";
import {UserSearcher} from "./UserSearcher";

export class UserDAO {
    private _collectionNameToConnect: string;

    public constructor(collectionNameToConnect) {
        this._collectionNameToConnect = collectionNameToConnect;
    }

    private checkIfUserExists(connectionReference: Db, userSearcher: UserSearcher): Promise<UserDTO> {
        let collectionFromConnectionReference: Collection = null;
        let userDTOfound: UserDTO = null;


        let mongodbFindUserByUsernameCriteria: string = null;

        try {
            collectionFromConnectionReference = connectionReference.collection(this._collectionNameToConnect);

            if (userSearcher.username_criteria !== null) {
                mongodbFindUserByUsernameCriteria = userSearcher.username_criteria;
            }

            CollectionIndexCreator.createIndex(collectionFromConnectionReference, DatabaseConstants.USERNAME_FIELD_NAME);

            return new Promise<UserDTO>((resolve, reject) => {
                collectionFromConnectionReference.find({"$text": {"$search": mongodbFindUserByUsernameCriteria}}).toArray((err, docs) => {
                    if (err) {
                        reject(err)
                    } else {
                        docs.map((userFound) => {
                            userDTOfound = new UserDTO();
                            userDTOfound._username = userFound._username;
                            userDTOfound._password = userFound._password;
                        });
                        resolve(userDTOfound);
                    }
                });
            });

        } catch (Exception) {
            throw Exception;
        }
    }

    public async registerNewUser(connectionReference: Db, userToInsert: UserDTO): Promise<void> {
        try {
            return new Promise<void>(async (resolve, reject) => {
                let userSearcherFromNewInsertRequest = new UserSearcher();
                userSearcherFromNewInsertRequest.username_criteria = userToInsert._username;
                let userFromDb = await this.checkIfUserExists(connectionReference, userSearcherFromNewInsertRequest);
                if (userFromDb === null) {
                    hash(userToInsert._password, 10, (err, hash) => {
                        if (err) {
                            reject(err)
                        } else {
                            userToInsert._password = hash;
                            connectionReference.collection(this._collectionNameToConnect).insertOne(userToInsert);
                            resolve()
                        }
                    });
                } else {
                    resolve(null);
                }
            })
        } catch (Exception) {
            throw Exception;
        }
    }

    public async loginUser(connectionReference: Db, userToVerify: UserDTO): Promise<UserDTO> {
        try {
            return new Promise<UserDTO>(async (resolve, reject) => {
                let userSearcherFromNewInsertRequest = new UserSearcher();
                userSearcherFromNewInsertRequest.username_criteria = userToVerify._username;
                let userFromDb = await this.checkIfUserExists(connectionReference, userSearcherFromNewInsertRequest);
                if (userFromDb !== null) {
                    compare(userToVerify._password, userFromDb._password, (err, res) => {
                        if (err) {
                            reject(err)
                        } else if (res) {
                            resolve(userFromDb)
                        } else {
                            resolve(null)
                        }
                    });
                }
            })
        } catch (Exception) {
            throw Exception;
        }
    }
}