import {ChangeDetectionStrategy, Component} from '@angular/core';
import {AuthenticateService} from "../../../../../../services/authenticate";
import {Router} from "@angular/router";
import {RouterActions} from "../../../../../../R/router/router.actions";
import {NotifyManager} from "../../../../../../services/notify-manager";

@Component({
             // moduleId: module.id,
             selector: 'configurations-default-container',
             templateUrl: 'container.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class ConfigurationsDefaultContainerComponent {
  constructor(private authService: AuthenticateService,
              protected notify: NotifyManager,
              public router: Router,
              protected routerActions: RouterActions) { }
  
  go(path: string) {
    this.routerActions.go(path);
  }
  
  cacheManager() {
    if (this.authService.userCan('flush_cache')) {
      this.go('pos/configurations/default/advanced/client-db');
    } else {
      this.notify.error("not_have_permission_to_flush_cache");
    }
  }
}
