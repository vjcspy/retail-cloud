import {NgModule} from "@angular/core";
import {SERVICES} from "./services/index";
import {COMPONENTS} from "./components/index";
import {PaymentComponent} from "./components/payment.component";
import {ReducerManagement} from "../../../../services/reducer-management";
import {paymentBraintreeReducer, R_EFFECTS, R_SERVICES} from "./R/index";
import {ShareModule} from "../../../share/share.module";

@NgModule({
            imports: [
              ShareModule,
              R_EFFECTS,
            ],
            exports: [
              PaymentComponent
            ],
            declarations: [
              ...COMPONENTS
            ],
            providers: [
              ...SERVICES,
              ...R_SERVICES
            ],
          })
export class PaymentBraintreeModule {
  constructor(protected reducer: ReducerManagement) {
    this.reducer.replaceReducer('payment_braintree_module', paymentBraintreeReducer());
  }
}
