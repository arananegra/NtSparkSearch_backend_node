import {GeneSearcher} from "../domain/GeneSearcher";
import {Collection, Db} from "mongodb";
import {GeneDTO} from "../domain/GeneDTO";
import {CollectionIndexCreator} from "./CollectionIndexCreator";
import {DatabaseConstants} from "../constants/DatabaseConstants";
import * as Q from "q";

export class GeneDAO {

    private _collectionNameToConnect: string;

    public constructor(collectionNameToConnect) {
        this._collectionNameToConnect = collectionNameToConnect;
    }

    public searchGeneObjectsAndReturnAListOfObjects(connectionReference: Db, geneSearcher: GeneSearcher): Q.IPromise<Array<GeneDTO>> {

        let deferred: Q.Deferred<Array<GeneDTO>>;
        deferred = Q.defer<Array<GeneDTO>>();
        let collectionFromConnectionReference: Collection = null;
        let singleGeneRecord: GeneDTO = null;
        let listGeneRecords: Array<GeneDTO> = null;

        let mongodbFindByIdCriteria: string = null;

        try {
            collectionFromConnectionReference = connectionReference.collection(this._collectionNameToConnect);
            listGeneRecords = new Array<GeneDTO>();

            if (geneSearcher.gene_id_criteria !== null) {
                mongodbFindByIdCriteria = geneSearcher.gene_id_criteria;
            }

            CollectionIndexCreator.createIndex(collectionFromConnectionReference, DatabaseConstants.GENE_ID_FIELD_NAME);

            collectionFromConnectionReference.find({"$text": {"$search": mongodbFindByIdCriteria}}).toArray((err, docs) => {
                docs.map((singleGenFound) => {
                    singleGeneRecord = new GeneDTO();
                    singleGeneRecord._geneId = singleGenFound._geneId;
                    singleGeneRecord._sequence = singleGenFound._sequence;

                    listGeneRecords.push(singleGenFound);
                });
                deferred.resolve(listGeneRecords);
            });
            return deferred.promise;

        } catch (Exception) {
            throw Exception;
        }
    }


}