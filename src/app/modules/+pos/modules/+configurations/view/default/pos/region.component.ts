import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";

@Component({
             // moduleId: module.id,
             selector: 'configurations-default-pos-region',
             templateUrl: 'region.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })

export class ConfigurationsDefaultPosRegionComponent implements OnInit {
  constructor(private store$: Store<any>) {
  
  }
  
  ngOnInit() { }
}
