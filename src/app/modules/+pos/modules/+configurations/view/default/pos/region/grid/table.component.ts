import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {ConfigurationsState} from "../../../../../R/index";
import * as _ from 'lodash';
import {RouterActions} from "../../../../../../../../../R/router/router.actions";
import {OutletHelper} from "../../../../../../../core/framework/outlet/Helper/OutletHelper";
import {ConfigurationsRegionActions} from "../../../../../R/region/region.actions";

@Component({
             // moduleId: module.id,
             selector: 'configurations-default-pos-region-grid-table',
             templateUrl: 'table.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })

export class ConfigurationsDefaultPosRegionGridTableComponent {
  @Input() configurationsState: ConfigurationsState;
  
  constructor(private routerActions: RouterActions, private configurationsRegionActions: ConfigurationsRegionActions ) {
  }
  
  refactorListOutletById(list: any[]) {
    let outletSelected = [];
    _.forEach(list, (value) => {
      outletSelected.push(OutletHelper.getOutletById(value));
      // ;
    });
    return outletSelected;
  }
  
  updateFilter(filterData) {
    this.configurationsRegionActions.updateRegionFilter(filterData);
  }
  
  editRegion(id) {
    this.routerActions.go('pos/configurations/default/pos/region/edit', id);
  }
}
