import {NgModule} from "@angular/core";
import {ReducerManagement} from "../../../../services/reducer-management";
import {ShareModule} from "../../../share/share.module";
import {paymentPaypalReducer, R_EFFECTS, R_SERVICES} from "./R/index";
import {PaypalComponents} from "./components/index";

@NgModule({
            imports: [
              ShareModule,
              R_EFFECTS,
            ],
            exports: [
              ...PaypalComponents
            ],
            declarations: [
              ...PaypalComponents
            ],
            providers: [
              ...R_SERVICES
            ],
          })
export class PaymentPaypalModule {
  constructor(protected reducer: ReducerManagement) {
    this.reducer.replaceReducer('payment_paypal_module', paymentPaypalReducer());
  }
}
