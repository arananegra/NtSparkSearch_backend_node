import {GeneSearcher} from "../domain/GeneSearcher";
import {MongoClient} from "mongodb";
import {GeneDTO} from "../domain/GeneDTO";
import {CollectionIndexCreator} from "./CollectionIndexCreator";

export class GeneDAO {

    public constructor() {
    }

    public searchGeneObjectsAndReturnAList(connectionReference: any, geneSearcher: GeneSearcher) {
        let singleGeneRecord: GeneDTO = null;
        let listGeneRecords: Array<GeneDTO> = null;

        let mongodbFindByIdCriteria = null;

        try {
            listGeneRecords = new Array<GeneDTO>();

            if (geneSearcher.gene_id_criteria === null) {
                mongodbFindByIdCriteria = geneSearcher.gene_id_criteria;
            }
            //let database connectionReference.db()


            //CollectionIndexCreator.createIndex()


        } catch (Exception) {
            throw Exception;
        }
    }


}