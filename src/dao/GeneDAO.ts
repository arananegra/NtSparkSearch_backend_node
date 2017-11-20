import {GeneSearcher} from "../domain/GeneSearcher";
import {Collection, Db} from "mongodb";
import {GeneDTO} from "../domain/GeneDTO";
import {CollectionIndexCreator} from "./CollectionIndexCreator";
import {DatabaseConstants} from "../constants/DatabaseConstants";
import * as Q from "q";
import * as Excel from 'exceljs/dist/es5/exceljs.browser';

export class GeneDAO {

    private _collectionNameToConnect: string;

    public constructor(collectionNameToConnect) {
        this._collectionNameToConnect = collectionNameToConnect;
    }

    public searchGenesAndReturnAListOfObjects(connectionReference: Db, geneSearcher: GeneSearcher): Q.IPromise<Array<GeneDTO>> {

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

    public getAllGenesAsListOfObjects(connectionReference: Db): Q.IPromise<Array<GeneDTO>> {
        let deferred: Q.Deferred<Array<GeneDTO>>;
        deferred = Q.defer<Array<GeneDTO>>();
        let collectionFromConnectionReference: Collection = null;
        let singleGeneRecord: GeneDTO = null;
        let listGeneRecords: Array<GeneDTO> = null;

        try {
            collectionFromConnectionReference = connectionReference.collection(this._collectionNameToConnect);
            listGeneRecords = new Array<GeneDTO>();

            collectionFromConnectionReference.find({}).toArray((err, docs) => {
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

    public getAllGenesAsMap(connectionReference: Db): Q.IPromise<Map<string, string>> {
        let deferred: Q.Deferred<Map<string, string>>;
        deferred = Q.defer<Map<string, string>>();

        let collectionFromConnectionReference: Collection = null;
        let mapOfGenes: Map<string, string> = null;
        try {
            mapOfGenes = new Map();
            collectionFromConnectionReference = connectionReference.collection(this._collectionNameToConnect);

            collectionFromConnectionReference.find({}).toArray((err, docs) => {
                docs.map((singleGenFound) => {
                    mapOfGenes.set(singleGenFound._geneId, singleGenFound._sequence)
                });
                deferred.resolve(mapOfGenes);
            });
            return deferred.promise;

        } catch (Exception) {
            throw Exception;
        }
    }

    public getListOfGenesFromXlrd(filePath: string, sheetNumber: number, columnName?: string) {
        let listOfGeneDTOs: Array<GeneDTO>;
        listOfGeneDTOs = new Array<GeneDTO>();

        try {
            let workbook: Excel.Workbook = new Excel.Workbook();

            workbook.xlsx.readFile(filePath).then(() => {
                let inboundWorksheet = workbook.getWorksheet(sheetNumber);
                inboundWorksheet.eachRow({includeEmpty: false}, (row, rowNumber) => {
                    console.log("Row " + rowNumber + " = " + JSON.stringify(row.values));
                });
            });

        } catch (Exception) {
            throw Exception;
        }
    }

    public insertGeneObject(connectionReference: Db, geneToInsert: GeneDTO) {
        try {
            connectionReference.collection(this._collectionNameToConnect).insertOne(geneToInsert);

        } catch (Exception) {
            throw Exception;
        }
    }

    public insertGenesFromListOfObjects(connectionReference: Db, genesToInsert: Array<GeneDTO>) {
        try {
            genesToInsert.map((geneToInsert) => {
                this.insertGeneObject(connectionReference, geneToInsert);
            });

        } catch (Exception) {
            throw Exception;
        }
    }

    public insertGeneDocumentFromNonObjectDict(connectionReference: Db, genesMapToInsert: Map<string, string>) {
        try {
            let list = genesMapToInsert.entries();
            for (let [key, value] of genesMapToInsert) {
                let geneDTO = new GeneDTO();
                geneDTO._geneId = key;
                geneDTO._sequence = value;

                this.insertGeneObject(connectionReference, geneDTO);
            }

        } catch (Exception) {
            throw Exception;
        }
    }
}