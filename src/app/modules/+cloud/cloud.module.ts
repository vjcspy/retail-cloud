import {NgModule} from '@angular/core';
import {CloudComponent} from "./cloud.component";
import {ShareModule} from "../share/share.module";
import {RouterModule} from "@angular/router";
import {CLOUD_ROUTES} from "./cloud.routes";

import "../../../styles/styles.scss";
import {CLOUD_DEFAULT_COMPONENTS} from "./view/default/index";
import {DefaultContainerComponent} from "./view/default-container.component";
import {AngularMeteorModule} from "../angular-meteor/index";

@NgModule({
            imports: [
              ShareModule,
              AngularMeteorModule,
              RouterModule.forChild(CLOUD_ROUTES)
            ],
            exports: [],
            declarations: [
              CloudComponent,
    
              DefaultContainerComponent,
              ...CLOUD_DEFAULT_COMPONENTS,
  
            ],
            providers: [],
          })
export class CloudModule {}
