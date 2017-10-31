// import {UserSearcherDTO} from "mks-appenco-domain/dist";
// import {UserBS} from "../bs/UserBS";
// import {ServicesRouteConstants} from "../constants/ServicesRouteConstants";
// import {HttpConstants, JsonSerializationBS} from "mks-standard-infraestructure/dist";
import {ServicesRouteConstants} from "../constants/ServicesRouteConstants";
import {GeneDTO} from "../domain/GeneDTO";
import {DbConnectionBS} from "../bs/DbConnectionBS";
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

                DbConnectionBS.getConnection()
                    .then((connection) => {
                        //console.log("La conexión en el serivce es ", connection);
                        connectionReference = connection;
                    }).then(() => {
                    let user = {
                        a: 'abc',
                    };
                    connectionReference.collection("testCollection").insertOne(user);

                });


                //connectionReference.collection("testCollection").insert(user);

                //console.log(connectionReference);
                let geneDTO = new GeneDTO();

                geneDTO._gene_id = "01";
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