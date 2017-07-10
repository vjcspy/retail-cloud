import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";

@Component({
             // moduleId: module.id,
             selector: 'configurations-default-pos-outlet-register',
             templateUrl: 'outlet-register.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })

export class ConfigurationsDefaultPosOutletRegisterComponent implements OnInit {
  constructor(private store$: Store<any>) {
  
  }
  
  ngOnInit() { }
}
