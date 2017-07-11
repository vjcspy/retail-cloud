import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
             // moduleId: module.id,
             selector: 'configurations-default-general',
             templateUrl: 'general.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })

export class ConfigurationsDefaultGeneralComponent implements OnInit {
  constructor() { }
  
  ngOnInit() { }
}
