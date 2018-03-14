import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {Store} from "@ngrx/store";
import {ConfigurationsState} from "../../../../R/index";
import {RouterActions} from "../../../../../../../../R/router/router.actions";
import {TutorialService} from "../../../../../+tutorial/tutorial.service";

@Component({
             // moduleId: module.id,
             selector: 'configurations-default-pos-outlet-register-grid',
             templateUrl: 'grid.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })

export class ConfigurationsDefaultPosOutletRegisterGridComponent {
  configurations$: Observable<ConfigurationsState>;
  
  constructor(private store$: Store<any>,
              private routerActions: RouterActions,
              private tourService: TutorialService) {
    this.configurations$ = this.store$.select('configurations');
  }
  
  newOutlet() {
    this.tourService.tour.pause();
    this.tourService.dispatchPauseTour();
    this.routerActions.go('pos/configurations/default/pos/outlet/edit', 0);
  }
}
