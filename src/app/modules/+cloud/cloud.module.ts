import {NgModule} from '@angular/core';
import {CloudComponent} from "./cloud.component";
import {ShareModule} from "../share/share.module";
import {RouterModule} from "@angular/router";
import {CLOUD_ROUTES} from "./cloud.routes";

import "../../../styles/styles.scss";
import {CLOUD_DEFAULT_COMPONENTS} from "./view/default/index";
import {DefaultContainerComponent} from "./view/default-container.component";
import {AngularMeteorModule} from "../angular-meteor/index";
import {R_EFFECTS, R_SERVICES} from "./R/index";
import {CLOUD_SERVICES} from "./services/index";
import {PaymentBraintreeModule} from "./modules/payment-braintree/payment-braintree.module";
import {MenuActions} from "./R/menu/actions";

@NgModule({
            imports: [
              ShareModule,
              AngularMeteorModule,
              RouterModule.forChild(CLOUD_ROUTES),
              PaymentBraintreeModule,
              ...R_EFFECTS,
            ],
            exports: [],
            declarations: [
              CloudComponent,
    
              DefaultContainerComponent,
              ...CLOUD_DEFAULT_COMPONENTS,
  
            ],
            providers: [
              ...R_SERVICES,
              ...CLOUD_SERVICES,
            ],
          })
export class CloudModule {
  constructor(protected menuActions: MenuActions) {
    this.menuActions.initCloudMenu();
  }
}
