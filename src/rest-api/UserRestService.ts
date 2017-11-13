// import {UserSearcherDTO} from "mks-appenco-domain/dist";
// import {UserBS} from "../bs/UserBS";
// import {ServicesRouteConstants} from "../constants/ServicesRouteConstants";
// import {HttpConstants, JsonSerializationBS} from "mks-standard-infraestructure/dist";
import {ServicesRouteConstants} from "../constants/ServicesRouteConstants";
import {GeneDTO} from "../domain/GeneDTO";
import {DbConnectionBS} from "../bs/DbConnectionBS";
import {MongoDBConfigurationDTO} from "../domain/MongoDBConfigurationDTO";
import {Db} from "mongodb"
import {CollectionIndexCreator} from "../dao/CollectionIndexCreator";
export class UserRestService {
    private _app: any;

    public constructor(app: any) {
        this._app = app;
        this.initializeUserServiceRoutes();
    }

    public initializeUserServiceRoutes() {
        this.searchUserById();
    }

    private searchUserById() {

        let connectionReference: any;

        this._app.get(ServicesRouteConstants.TEST_SERVICE, (req, res) => {
            try {
                // userSearcher = new UserSearcherDTO();
                // userBS = new UserBS();
                //
                // userSearcher.userIdSearchCriteria = req.params.id;

                let mongoDbDTO: MongoDBConfigurationDTO = new MongoDBConfigurationDTO();
                mongoDbDTO.client_reference = "localhost";
                mongoDbDTO.port = "27017";
                mongoDbDTO.database_name = "testDB";

                let gene_dto  = new GeneDTO();

                gene_dto._geneId = "04";
                gene_dto._sequence = "GATCAGC";

                //let db: Db = null;

                DbConnectionBS.getConnection(mongoDbDTO)
                    .then((connection) => {
                        connectionReference = connection;
                    }).then(() => {
                    //console.log("ESTA ES LA CONEXION", connectionReference);

                    connectionReference.collection("testCollection").insert(gene_dto);
                    CollectionIndexCreator.createIndex(connectionReference, "_geneId","testCollection")

                });

                //console.log(connectionReference);
                let geneDTO = new GeneDTO();

                geneDTO._geneId = "01";
                geneDTO._sequence = "GATCA";

                res.status(200).send(JSON.stringify(geneDTO));

                // userBS.searchSingleUserById(userSearcher)
                //     .then((singleUserFound) => {
                //         if (singleUserFound) {
                //
                //             JsonSerializationBS.serialization(singleUserFound)
                //                 .then((serializedObject) => {
                //                     res.status(200).send(serializedObject);
                //                 });
                //         } else {
                //             res.status(404);
                //         }
                //     });

            } catch (Exception) {
                console.log("Es un exceptionnnn!!!!", Exception);
                res.status(500).send(Exception);
            }
        });
    }
}