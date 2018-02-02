// import {UserSearcherDTO} from "mks-appenco-domain/dist";
// import {UserBS} from "../bs/UserBS";
// import {ServicesRouteConstants} from "../constants/ServicesRouteConstants";
// import {HttpConstants, JsonSerializationBS} from "mks-standard-infraestructure/dist";
import {ServicesRouteConstants} from "../constants/ServicesRouteConstants";
import {GeneDTO} from "../domain/GeneDTO";
import {DbConnectionBS} from "../bs/DbConnectionBS";
import {MongoDBConfigurationDTO} from "../domain/MongoDBConfigurationDTO";
import * as express from "express";
import {Db} from "mongodb"
import {CollectionIndexCreator} from "../dao/CollectionIndexCreator";
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

        let connectionReference: any;

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

                let gene_searcher = new GeneSearcher();
                gene_searcher.gene_id_criteria = "014";

                let mapOfTest = new Map();

                mapOfTest.set("012", "GCTGACA");
                mapOfTest.set("015", "TTTTTT");

                //
                // let listOfGenes = gene_bs.searchGenesAndReturnAListOfObjects(gene_searcher).then((result) => {
                //     console.log("La lista de genes encontradooooos", result);
                // });


                // console.log("EL MAP A INSERTAR", mapOfTest);

                await gene_dao.insertGeneDocumentFromNonObjectDict(connection, mapOfTest);

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
                //
                // let ncbiTest = gene_bs.downloadGeneObjectsFromListOfIdsThroughNcbi(gene_list).then((list_downloaded) => {
                //     gene_dao.insertGenesFromListOfObjects(connection, list_downloaded);
                //     console.log("Insertadooooooosss")
                // });
                // console.log("El servicio no se queda pillado");

                ////////////////////////////////////////////////////

                /*                DbConnectionBS.getConnection(mongoDbDTO)
                                    .then((connection) => {
                                        connectionReference = connection;
                                    }).then(() => {
                                    //console.log("ESTA ES LA CONEXION", connectionReference);

                                    //connectionReference.collection("testCollection").insert(gene_dto);
                                    //CollectionIndexCreator.createIndex(connectionReference.collection("testCollection"), "_geneId");
                                    let gene_searcher = new GeneSearcher();
                                    gene_searcher.gene_id_criteria = "01";

                                    let gene_dao = new GeneDAO("testCollection");

                                    let lista_response = [];
                                    gene_dao.searchGenesAndReturnAListOfObjects(connectionReference, gene_searcher).then(
                                        (response) => {
                                            console.log("REPSUESTAAA", response);
                                            lista_response = response;
                                        }
                                    );

                                    console.log("LA RESPUESTA FINAL", lista_response);

                                });*/


                //console.log(connectionReference);
                let geneDTO = new GeneDTO();

                geneDTO._geneId = "02";
                geneDTO._sequence = "GATCA";

                res.status(200).send(JSON.stringify(geneDTO));

            } catch (Exception) {
                console.log("Es un exceptionnnn del servicioo!!!!", Exception);
                res.status(500).send(Exception);
            }
        });
    }
}