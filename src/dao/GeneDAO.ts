import {GeneSearcher} from "../domain/GeneSearcher";
import {Collection, Db} from "mongodb";
import {GeneDTO} from "../domain/GeneDTO";
import {CollectionIndexCreator} from "./CollectionIndexCreator";
import {DatabaseConstants} from "../constants/DatabaseConstants";
import * as Q from "q";
import * as XLSX from "xlsx";
import * as _ from "lodash";
import * as fasta from "bionode-fasta"
import Axios, {AxiosPromise} from "axios";
import {parseString} from "xml2js"
import {async} from "q";

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

    public getListOfGenesFromXlrd(filePath: string, sheetNumber: number): Array<GeneDTO> {
        let listOfGeneDTOs: Array<GeneDTO>;
        listOfGeneDTOs = new Array<GeneDTO>();
        try {
            let workbook = XLSX.readFile(filePath);

            let worksheet = workbook.Sheets[workbook.SheetNames[sheetNumber - 1]];

            XLSX.utils.sheet_to_json(worksheet, {raw: false}).map((singleExcelRow) => {
                let singleGeneDTO = new GeneDTO();
                singleGeneDTO._geneId = singleExcelRow["gene_id"];
                listOfGeneDTOs.push(singleGeneDTO)
            });

            return _.uniqBy(listOfGeneDTOs, DatabaseConstants.GENE_ID_FIELD_NAME);
        } catch (Exception) {
            throw Exception;
        }
    }

    public getListOfGenesFromFasta(filePath: string): Q.IPromise<Array<GeneDTO>> {
        let deferred: Q.Deferred<Array<GeneDTO>>;
        deferred = Q.defer<Array<GeneDTO>>();
        let geneDtoList: Array<GeneDTO> = [];
        try {

            fasta({objectMode: true}, filePath)
                .on('data', (singleRowFromFasta) => {
                    let singleGeneDto: GeneDTO = new GeneDTO();
                    singleGeneDto._geneId = singleRowFromFasta.id;
                    singleGeneDto._sequence = singleRowFromFasta.seq;
                    geneDtoList.push(singleGeneDto);
                    deferred.resolve(geneDtoList);
                });

            return deferred.promise;
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

    public async downloadGeneFromNcbi(singleGene: GeneDTO): Promise<GeneDTO> {
        let deferred: Q.Deferred<GeneDTO>;
        deferred = Q.defer<GeneDTO>();
        let fulFilledGeneObject = null;

        try {
            let metaInfoAboutGene = await this.getMetaInfoAboutGene(singleGene._geneId);
            parseString(metaInfoAboutGene, async (err, result) => {
                let geneRegion = result['Entrezgene-Set']["Entrezgene"][0]["Entrezgene_locus"][0]["Gene-commentary"][0]
                    ["Gene-commentary_seqs"][0]["Seq-loc"][0]['Seq-loc_int'][0]['Seq-interval'];
                let startPos = Number(geneRegion[0]["Seq-interval_from"][0]) + 1;
                let endPost = Number(geneRegion[0]["Seq-interval_to"][0]) + 1;

                let intervalId = geneRegion[0]["Seq-interval_id"][0]["Seq-id"][0]["Seq-id_gi"][0];

                let strandSense = geneRegion[0]["Seq-interval_strand"][0]["Na-strand"][0]["$"]["value"];
                strandSense === "minus" ? strandSense = 2 : strandSense = 1;

                let fastaResponse = await this.getFastaFromGene(intervalId, startPos, endPost, strandSense);
                let fastaResponseWithoutHeader = fastaResponse.substring(fastaResponse.indexOf("\n") + 1);
                let fastaSingleLine = fastaResponseWithoutHeader.replace(/[\n]/g, "");

                let singleFulFilledGene = new GeneDTO();
                singleFulFilledGene._geneId = singleGene._geneId;
                singleFulFilledGene._sequence = fastaSingleLine;
                fulFilledGeneObject = singleFulFilledGene;
                deferred.resolve(fulFilledGeneObject);
            });
            return deferred.promise;
        } catch (Exception) {
            throw Exception;
        }
    }

    private getMetaInfoAboutGene(geneId: string): Promise<string> {
        return Axios.get('https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=gene&id='
            + geneId + '&retmode=xml')
            .then(response => {
                return response.data;
            }).catch(Exception => {
                throw Exception;
            });
    }

    private getFastaFromGene(intervalId: string, startPos: number, endPost: number, strandSense: string): Promise<string> {
        return Axios.get('https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=nuccore&retmode=text' +
            '&rettype=fasta&id=' + intervalId + "&seq_start=" + String(startPos) +
            "&seq_stop=" + String(endPost) + "&strand=" + strandSense)
            .then(response => {
                return response.data;
            }).catch(Exception => {
                throw Exception;
            });
    }
}