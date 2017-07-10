import {ChangeDetectionStrategy, Component} from '@angular/core';
import {configurationsReducer} from "./R/index";
import {ReducerManagement} from "../../../../services/reducer-management";

@Component({
             // moduleId: module.id,
             selector: 'configurations',
             template: `
               <div class="xcontainer-wrapper open">
                 <div class="xcontainer-inner">
                   <router-outlet></router-outlet>
                 </div>
               </div>
             `,
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class ConfigurationsComponent {
  constructor(private reducerManagement: ReducerManagement) {
    this.reducerManagement.replaceReducer('configurationsReducer', configurationsReducer());
  }
}