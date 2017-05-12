import {
  AfterViewInit,
  Component,
  OnInit
} from '@angular/core';
import {AbstractRxComponent} from "../../../code/angular/AbstractRxComponent";
import {Router} from "@angular/router";
import {RouterActions} from "../../../R/router/router.action";

@Component({
             selector: 'z-sidebar',
             templateUrl: 'sidebar.html'
           })
export class SideBarComponent extends AbstractRxComponent implements OnInit, AfterViewInit {
  constructor(protected router: Router, protected routerActions: RouterActions) {
    super();
  }
  
  ngOnInit() {
  }
  
  ngAfterViewInit(): void {
    setTimeout(() => { OneUI['init']('uiNav');}, 1000);
  }
}
