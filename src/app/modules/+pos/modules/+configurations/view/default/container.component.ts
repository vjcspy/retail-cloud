import {Component, OnInit} from '@angular/core';
import {AuthenticateService} from "../../../../../../services/authenticate";
import {Router} from "@angular/router";
import {RouterActions} from "../../../../../../R/router/router.actions";

@Component({
             // moduleId: module.id,
             selector: 'configurations-default-container',
             templateUrl: 'container.component.html'
           })
export class ConfigurationsDefaultContainerComponent implements OnInit {
  constructor(private authService: AuthenticateService,
              public router: Router,
              protected routerActions: RouterActions) { }
  
  ngOnInit() { }
  
  backPos() {
    this.routerActions.go('pos/default/sales/checkout');
  }
}
