import {
  AfterViewInit,
  Component,
  OnInit
} from '@angular/core';
import {AbstractRxComponent} from "../../../code/angular/AbstractRxComponent";
import {Router} from "@angular/router";

@Component({
             selector: 'z-sidebar',
             templateUrl: 'sidebar.html'
           })
export class SideBarComponent extends AbstractRxComponent implements OnInit, AfterViewInit {
  constructor(protected router: Router) {
    super();
  }
  
  ngOnInit() {
  }
  
  ngAfterViewInit(): void {
    setTimeout(() => { OneUI['init']('uiNav');}, 1000);
  }
}
