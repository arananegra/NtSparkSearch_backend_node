import {GeneDTO} from "../domain/GeneDTO";
import {GeneDAO} from "../dao/GeneDAO";
import {MessageConstants} from "../constants/MessageConstants";
import {Db} from "mongodb";
import {GeneSearcher} from "../domain/GeneSearcher";
import * as _ from "lodash";

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
        try {
            return this._geneDAO.searchGenesAndReturnAListOfObjects(this._connectionReference, geneSearcher)

        } catch (Exception) {
            throw Exception;
        }
    }

    public getAllGenesAsListOfObjects(): Promise<Array<GeneDTO>> {
        try {
            return this._geneDAO.getAllGenesAsListOfObjects(this._connectionReference)

        } catch (Exception) {
            throw Exception;
        }
    }

    public getAllGenesAsMap(): Promise<Map<string, string>> {
        try {
            return this._geneDAO.getAllGenesAsMap(this._connectionReference)

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

    public getListOfGenesFromFasta(filePath: string): Promise<Array<GeneDTO>> {
        try {
            return this._geneDAO.getListOfGenesFromFasta(filePath)
        } catch (Exception) {
            throw Exception;
        }
    }

    public async downloadGeneObjectsFromListOfIdsThroughNcbi(listOfGenesToDownload: Array<GeneDTO>): Promise<Array<GeneDTO>> {
        let listDownloadedGenes: Array<GeneDTO> = null;
        return new Promise<Array<GeneDTO>>(async (resolve, reject) => {
                try {
                    listDownloadedGenes = new Array<GeneDTO>();

                    for (let singleGenIndex = 0; singleGenIndex < listOfGenesToDownload.length; singleGenIndex++) {
                        try {
                            let downloadedGene = await this._geneDAO.downloadGeneFromNcbi(listOfGenesToDownload[singleGenIndex]);
                            console.log("Downloaded gen number " + singleGenIndex + " with id ", listOfGenesToDownload[singleGenIndex]._geneId);
                            listDownloadedGenes.push(downloadedGene);

                        } catch (Exception) {
                            listOfGenesToDownload[singleGenIndex]._sequence = null;
                            listDownloadedGenes.push(listOfGenesToDownload[singleGenIndex]);
                            console.error(MessageConstants.DOWNLOAD_ERROR_MESSAGE);
                        }
                    }
                    resolve(listDownloadedGenes);
                } catch (Exception) {
                    throw Exception;
                }
            }
        );
    }

    public async incrementalDownloadAndInsertionOfGenes(listOfGenesToDownload: Array<GeneDTO>, sizeOfChunk: number): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {

            try {
                let chunksArrayOfGenes = _.chunk(listOfGenesToDownload, sizeOfChunk);

                for (let chunkedArrayOfGenes of chunksArrayOfGenes) {
                    let partialDownloadOfGenes = await this.downloadGeneObjectsFromListOfIdsThroughNcbi(chunkedArrayOfGenes);
                    this.insertGenesFromListOfObjects(partialDownloadOfGenes);
                }
                resolve();
            } catch (Exception) {
                reject(Exception);
            }
        });
    }


    public insertGenesFromListOfObjects(listOfGenesToInsert: Array<GeneDTO>) {
        try {
            this._geneDAO.insertGenesFromListOfObjects(this._connectionReference, listOfGenesToInsert)

        } catch (Exception) {
            throw Exception;
        }
    }
}