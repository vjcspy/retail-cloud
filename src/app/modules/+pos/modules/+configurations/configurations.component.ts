import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Store} from "@ngrx/store";
import {configurationsReducer} from "./R/index";

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
  constructor(private store$: Store<any>) {
    this.store$.replaceReducer(configurationsReducer);
  }
}
