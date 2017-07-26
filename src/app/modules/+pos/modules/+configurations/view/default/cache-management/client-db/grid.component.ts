import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {ConfigurationsClientDbState} from "../../../../R/cache/client-db/client-db.state";
import {ConfigurationsClientDbActions} from "../../../../R/cache/client-db/client-db.actions";

@Component({
             // moduleId: module.id,
             selector: 'configurations-default-cache-management-client-db-grid',
             templateUrl: 'grid.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush,
             styleUrls: ['grid.component.scss']
           })

export class ConfigurationsDefaultCacheManagementClientDBGridComponent implements OnInit {
  @Input() clientDbState: ConfigurationsClientDbState;
  
  constructor(public clientDbActions: ConfigurationsClientDbActions) { }
  
  ngOnInit() { }
  
  getDateTimeString(time) {
    return new Date(time);
  }
}
