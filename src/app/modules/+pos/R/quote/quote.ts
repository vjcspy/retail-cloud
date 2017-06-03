import {Quote} from "../../core/framework/quote/Model/Quote";
import {ObjectManager} from "../../core/framework/General/App/ObjectManager";
import {SessionQuote} from "../../core/framework/Backend/Model/Session/Quote";

export class PosQuote {
  static getQuote(): Quote {
    return ObjectManager.getInstance().get<SessionQuote>(SessionQuote.CODE_INSTANCE, SessionQuote).getQuote();
  }
}
