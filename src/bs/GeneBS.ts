import {GeneDTO} from "../domain/GeneDTO";
import * as Q from "q";
import {GeneDAO} from "../dao/GeneDAO";
import {MessageConstants} from "../constants/MessageConstants";
import {Db} from "mongodb";
import {GeneSearcher} from "../domain/GeneSearcher";

export class GeneBS {
    private _collectionNameToConnect: string;
    private _geneDAO: GeneDAO;
    private _connectionReference: Db;

    public constructor(collectionNameToConnect, connectionReference) {
        this._collectionNameToConnect = collectionNameToConnect;
        this._geneDAO = new GeneDAO(collectionNameToConnect);
        this._connectionReference = connectionReference;
    }

    public searchGenesAndReturnAListOfObjects(geneSearcher: GeneSearcher): Promise<Array<GeneDTO>> {
        let listGeneRecords: Array<GeneDTO> = null;

        try {
            return new Promise<Array<GeneDTO>>((resolve, reject) => {
                this._geneDAO.searchGenesAndReturnAListOfObjects(this._connectionReference, geneSearcher).then((resultListOfGenes) => {
                    listGeneRecords = resultListOfGenes;
                    resolve(listGeneRecords);
                }).catch(err => reject(err))
            });
        } catch (Exception) {
            throw Exception;
        }
    }

    public getAllGenesAsListOfObjects(): Promise<Array<GeneDTO>> {
        try {
            return new Promise<Array<GeneDTO>>((resolve, reject) => {
                this._geneDAO.getAllGenesAsListOfObjects(this._connectionReference).then((resultListOfGenes) => {
                    resolve(resultListOfGenes)
                }).catch(err => reject(err))
            });

        } catch (Exception) {
            throw Exception;
        }
    }

    public getAllGenesAsMap(): Q.IPromise<Map<string, string>> {
        let deferred: Q.Deferred<Map<string, string>>;
        deferred = Q.defer<Map<string, string>>();
        let mapOfGenes: Map<string, string> = null;

        try {
            this._geneDAO.getAllGenesAsMap(this._connectionReference).then((resultMapOfGenes) => {
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