// import {UserSearcherDTO} from "mks-appenco-domain/dist";
// import {UserBS} from "../bs/UserBS";
// import {ServicesRouteConstants} from "../constants/ServicesRouteConstants";
// import {HttpConstants, JsonSerializationBS} from "mks-standard-infraestructure/dist";
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
        // let userSearcher: UserSearcherDTO;
        // let userBS: UserBS;
        //
        // this._app.get(ServicesRouteConstants.USER_SERVICE + "/:id", (req, res) => {
        //     try {
        //         userSearcher = new UserSearcherDTO();
        //         userBS = new UserBS();
        //
        //         userSearcher.userIdSearchCriteria = req.params.id;
        //
        //         userBS.searchSingleUserById(userSearcher)
        //             .then((singleUserFound) => {
        //                 if (singleUserFound) {
        //
        //                     JsonSerializationBS.serialization(singleUserFound)
        //                         .then((serializedObject) => {
        //                             res.status(HttpConstants.HTTP_CODE_200).send(serializedObject);
        //                         });
        //                 } else {
        //                     res.status(HttpConstants.HTTP_CODE_404);
        //                 }
        //             });
        //
        //     } catch(Exception) {
        //         res.status(HttpConstants.HTTP_CODE_500).send("Service Unavailable");
        //     }
        // });
    }
}