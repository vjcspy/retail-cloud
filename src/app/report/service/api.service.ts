import {Injectable} from "@angular/core";
@Injectable()
export class ApiService {
    private _middleUrl:string = "xrest/v1/xretail";
    private _isSecureHttp;
    private _apiUrl           = {
        dashboard: 'report',
        salesreport: 'salesreport',
        shiftreport: 'shiftreport',
    };

    constructor() {
    }

    get(apiKey):string {
        return this._isSecureHttp ?
            "https://" :
        "http://" +
        "mage191.local" +
        "/" +
        this._middleUrl +
        "/" +
        this._apiUrl[apiKey];
    }
}