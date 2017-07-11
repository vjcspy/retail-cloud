import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
             // moduleId: module.id,
             selector: 'configurations-default-cache-management',
             templateUrl: 'cache-management.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class ConfigurationsDefaultCacheManagement implements OnInit {
  constructor() { }
  
  ngOnInit() { }
  
}
