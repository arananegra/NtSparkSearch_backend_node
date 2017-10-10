import {ServicesRouteConstants} from "../constants/ServicesRouteConstants";
export class UrlFactoryBS {

    public static buildUrl(serviceUrl: string): string {
        return ServicesRouteConstants.BASE_URL + serviceUrl;
    }
}