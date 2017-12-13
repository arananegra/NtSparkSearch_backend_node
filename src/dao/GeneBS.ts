import {GeneDTO} from "../domain/GeneDTO";
import * as Q from "q";
import Axios from 'axios';
import {GeneDAO} from "./GeneDAO";
import {MessageConstants} from "../constants/MessageConstants";

export class GeneBS {
    private _collectionNameToConnect: string;
    private _geneDAO: GeneDAO;

    public constructor(collectionNameToConnect) {
        this._collectionNameToConnect = collectionNameToConnect;
        this._geneDAO = new GeneDAO(collectionNameToConnect);
    }

    public async downloadGeneObjectsFromListOfIdsThroughNcbi(listOfGenesToDownload: Array<GeneDTO>): Promise<Array<GeneDTO>> {
        let deferred: Q.Deferred<Array<GeneDTO>>;
        deferred = Q.defer<Array<GeneDTO>>();
        let listDownloadedGenes: Array<GeneDTO> = null;

        try {
            listDownloadedGenes = new Array<GeneDTO>();
            for (let singleGen of listOfGenesToDownload) {
                console.log("Voy a descargar el gen ", singleGen._geneId);
                try {
                    let downloadedGene = await this._geneDAO.downloadGeneFromNcbi(singleGen);
                    console.log("Descargado el gen ", downloadedGene._geneId);
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