import {Quote} from "../../../quote/Model/Quote";
import {ShareInstance} from "../../../General/ObjectManager/ShareInstance";
import {Create} from "../../../sales/Model/AdminOrder/Create";
export class SessionQuote implements ShareInstance {
    static CODE_INSTANCE = "SessionQuote";
    private _quoteInstance: Quote;
    private _salesCreateInstance: Create;

    getQuote(): Quote {
        if (typeof this._quoteInstance == "undefined")
            this._quoteInstance = new Quote();
        return this._quoteInstance;
    }

    getSalesCreate(): Create {
        if (typeof this._salesCreateInstance == "undefined")
            this._salesCreateInstance = new Create();
        return this._salesCreateInstance;
    }

}