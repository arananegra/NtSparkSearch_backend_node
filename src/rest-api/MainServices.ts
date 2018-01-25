import {UserRestService} from "./UserRestService";
import * as express from "express";

export class MainServices {

    public constructor(applicationRouter: express.Router) {
        // new ClinicalTrialPhaseRestService(application);
        // new ClinicalTrialRestService(application);
        // new ClinicalTrialStageRestService(application);
        // new ClinicalTrialStateRestService(application);
        // new TumorLocalizationRestService(application);
        // new EconomicFundingTypeRestService(application);
        // new ExclusionInclusionCriteriaRestService(application);
        new UserRestService(applicationRouter);
        // new RolPermissionRestService(application);
    }
}