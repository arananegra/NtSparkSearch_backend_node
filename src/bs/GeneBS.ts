import {GeneDTO} from "../domain/GeneDTO";
import * as Q from "q";
import {GeneDAO} from "../dao/GeneDAO";
import {MessageConstants} from "../constants/MessageConstants";
import {Db} from "mongodb";
import {GeneSearcher} from "../domain/GeneSearcher";

export class GeneBS {
    private _collectionNameToConnect: string;
    private _geneDAO: GeneDAO;

    public constructor(collectionNameToConnect) {
        this._collectionNameToConnect = collectionNameToConnect;
        this._geneDAO = new GeneDAO(collectionNameToConnect);
    }

    public searchGenesAndReturnAListOfObjects(connectionReference: Db, geneSearcher: GeneSearcher): Q.IPromise<Array<GeneDTO>> {
        let deferred: Q.Deferred<Array<GeneDTO>>;
        deferred = Q.defer<Array<GeneDTO>>();
        let listGeneRecords: Array<GeneDTO> = null;

        try {
            this._geneDAO.searchGenesAndReturnAListOfObjects(connectionReference, geneSearcher).then((resultListOfGenes) => {
                listGeneRecords = resultListOfGenes;
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
        let listGeneRecords: Array<GeneDTO> = null;

        try {
            this._geneDAO.getAllGenesAsListOfObjects(connectionReference).then((resultListOfGenes) => {
                listGeneRecords = resultListOfGenes;
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
        let mapOfGenes: Map<string, string> = null;

        try {
            this._geneDAO.getAllGenesAsMap(connectionReference).then((resultMapOfGenes) => {
                mapOfGenes = resultMapOfGenes;
                deferred.resolve(mapOfGenes);
            });
            return deferred.promise;

        } catch (Exception) {
            throw Exception;
        }
    }

    public getListOfGenesFromXlrd(filePath: string, sheetNumber: number): Array<GeneDTO> {
        try {
            return this._geneDAO.getListOfGenesFromXlrd(filePath, sheetNumber);
        } catch (Exception) {
            throw Exception;
        }
    }
    //TODO: deferred.resolve(null);
    public getListOfGenesFromFasta(filePath: string): Q.IPromise<Array<GeneDTO>> {
        let deferred: Q.Deferred<Array<GeneDTO>>;
        deferred = Q.defer<Array<GeneDTO>>();
        let geneDtoList: Array<GeneDTO> = new Array<GeneDTO>();
        try {
            this._geneDAO.getListOfGenesFromFasta(filePath).then((resultListOfGenes) => {
                geneDtoList = resultListOfGenes;
                deferred.resolve(geneDtoList);
            });
            return deferred.promise;
        } catch (Exception) {
            throw Exception;
        }
    }

    public async downloadGeneObjectsFromListOfIdsThroughNcbi(listOfGenesToDownload: Array<GeneDTO>): Promise<Array<GeneDTO>> {
        let deferred: Q.Deferred<Array<GeneDTO>>;
        deferred = Q.defer<Array<GeneDTO>>();
        let listDownloadedGenes: Array<GeneDTO> = null;

        try {
            listDownloadedGenes = new Array<GeneDTO>();
            for (let singleGen of listOfGenesToDownload) {
                try {
                    let downloadedGene = await this._geneDAO.downloadGeneFromNcbi(singleGen);
                    listDownloadedGenes.push(downloadedGene);

                } catch (Exception) {
                    singleGen._sequence = null;
                    listDownloadedGenes.push(singleGen);
                    console.error(MessageConstants.DOWNLOAD_ERROR_MESSAGE);
                    continue;
                }
            }
            deferred.resolve(listDownloadedGenes);
            return deferred.promise;

        } catch (Exception) {
            throw Exception;
        }
    }
}