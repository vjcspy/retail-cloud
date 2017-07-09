import {ChangeDetectionStrategy, Component} from '@angular/core';
import {AuthenticateService} from "../../../../../../services/authenticate";
import {Router} from "@angular/router";
import {RouterActions} from "../../../../../../R/router/router.actions";

@Component({
             // moduleId: module.id,
             selector: 'configurations-default-container',
             templateUrl: 'container.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class ConfigurationsDefaultContainerComponent {
  constructor(private authService: AuthenticateService,
              public router: Router,
              protected routerActions: RouterActions) { }
  
  go(path: string) {
    this.routerActions.go(path);
  }
}
