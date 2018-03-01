import {ServicesRouteConstants} from "../constants/ServicesRouteConstants";
import {GeneDTO} from "../domain/GeneDTO";
import {DbConnectionBS} from "../bs/DbConnectionBS";
import {MongoDBConfigurationDTO} from "../domain/MongoDBConfigurationDTO";
import * as express from "express";
import {GeneDAO} from "../dao/GeneDAO";
import {GeneSearcher} from "../domain/GeneSearcher";
import {GeneBS} from "../bs/GeneBS";

export class UserRestService {
    private _app: express.Router;

    public constructor(app: express.Router) {
        this._app = app;
        this.initializeUserServiceRoutes();
    }

    public initializeUserServiceRoutes() {
        this.searchUserById();
    }

    private async searchUserById() {

        this._app.get(ServicesRouteConstants.TEST_SERVICE, async function (req: express.Request, res: express.Response) {
            try {

                let mongoDbDTO: MongoDBConfigurationDTO = new MongoDBConfigurationDTO();
                mongoDbDTO.clientReference = "localhost";
                mongoDbDTO.port = "27017";
                mongoDbDTO.databaseName = "testDB";

                let gene_dto = new GeneDTO();

                gene_dto._geneId = "01";
                gene_dto._sequence = "GATCAGC";


                let connection = await DbConnectionBS.getConnection(mongoDbDTO);
                let gene_dao = new GeneDAO("testCollection");
                let gene_bs = new GeneBS("testCollection", connection);
                let lista_response;

                // let gene_searcher = new GeneSearcher();
                // gene_searcher.gene_id_criteria = "0";

                // let mapOfTest = new Map();
                //
                // mapOfTest.set("012", "GCTGACA");
                // mapOfTest.set("015", "TTTTTT");


                // gene_bs.searchGenesAndReturnAListOfObjects(gene_searcher).then((result) => {
                //     console.log("La lista de genes encontradooooos", listOfGenes);
                //     res.status(200).send(JSON.stringify(result));
                // });


                // console.log("EL MAP A INSERTAR", mapOfTest);

                //await gene_dao.insertGeneDocumentFromNonObjectDict(connection, mapOfTest);

                // let allGenes = await gene_bs.getAllGenesAsListOfObjects();
                // console.log(allGenes);

                //let thing = await gene_dao.getListOfGenesFromFasta("/Users/alvarogomez/testing_files/test.fasta");
                //console.log("LO QUE OBTENGO DEL fasta,", thing);

                //console.log("LA RESPUESTA FINAL", lista_response);

                // let ncbiTest = gene_dao.downloadGeneFromNcbi(gene_dto).then((theGeneDTO) => {
                //     gene_dao.insertGeneObject(connection, theGeneDTO);
                //     console.log("insertaddooooooo");
                // }).catch(Exception => {
                //     console.log(Exception);
                // });
                // console.log("El servicio no se queda pillado");
                //console.log(ncbiTest);

                // let gene_dto_1 = new GeneDTO();
                // gene_dto_1._geneId = "12";
                //
                // let gene_dto_2 = new GeneDTO();
                // gene_dto_2._geneId = "20";
                //
                // let gene_dto_2_5 = new GeneDTO();
                // gene_dto_2_5._geneId = "0";
                //
                // let gene_dto_3 = new GeneDTO();
                // gene_dto_3._geneId = "19";
                //
                // let gene_list = new Array<GeneDTO>();
                // gene_list.push(gene_dto_1);
                // gene_list.push(gene_dto_2);
                // gene_list.push(gene_dto_2_5);
                // gene_list.push(gene_dto_3);
                // //

                let gene_list = await gene_dao.getListOfGenesFromXlrd("/home/alvaro-pc/Desktop/DEG.xlsx", 1);
                // let ncbiTest = gene_bs.downloadGeneObjectsFromListOfIdsThroughNcbi(gene_list).then((list_downloaded) => {
                //     gene_bs.insertGenesFromListOfObjects(list_downloaded);
                //     console.log("Insertadooooooosss")
                // });


                gene_bs.incrementalDownloadAndInsertionOfGenes(gene_list, 100).then(() => {
                    console.log("He hecho la inserción finalmente ");
                })
                console.log("El servicio no se queda pillado");


                res.status(202).send();

            } catch (Exception) {
                console.log("Es un exceptionnnn del servicioo!!!!", Exception);
                res.status(500).send(Exception);
            }
        });
    }
}