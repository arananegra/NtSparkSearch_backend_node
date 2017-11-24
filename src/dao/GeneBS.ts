import {GeneDTO} from "../domain/GeneDTO";
import * as Q from "q";
import axios from 'axios';

export class GeneBS {
    private _collectionNameToConnect: string;

    public constructor(collectionNameToConnect) {
        this._collectionNameToConnect = collectionNameToConnect;
    }

    public downloadGeneObjectsFromListOfIdsThroughNcbi(listOfIds: Array<string>) {

        axios


    }
}