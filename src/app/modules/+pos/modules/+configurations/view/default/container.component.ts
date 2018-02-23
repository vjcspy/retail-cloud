import {ChangeDetectionStrategy, Component} from '@angular/core';
import {AuthenticateService} from "../../../../../../services/authenticate";
import {Router} from "@angular/router";
import {RouterActions} from "../../../../../../R/router/router.actions";
import {TutorialService} from "../../../+tutorial/tutorial.service";

@Component({
             // moduleId: module.id,
             selector: 'configurations-default-container',
             templateUrl: 'container.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class ConfigurationsDefaultContainerComponent {
  constructor(private authService: AuthenticateService,
              public router: Router,
              protected routerActions: RouterActions,
              protected tourService: TutorialService) { }
  
  go(path: string) {
    this.routerActions.go(path);
  }
  
  goToCheckOut() {
    this.tourService.tour.pause();
    this.go('pos/default/sales/checkout');
  }
}
