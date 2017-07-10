import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {ConfigurationsState} from "../../../../../R/index";
import {StoreHelper} from "../../../../../../../core/framework/store/Helper/StoreHelper";
import {ConfigurationsOutletActions} from "../../../../../R/outlets/outlet.actions";
import {RouterActions} from "../../../../../../../../../R/router/router.actions";

@Component({
             // moduleId: module.id,
             selector: 'configurations-default-pos-outlet-register-grid-table',
             templateUrl: 'table.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })

export class ConfigurationsDefaultPosOutletRegisterGridTableComponent {
  @Input() configurationsState: ConfigurationsState;
  
  constructor(private configurationsOutletActions: ConfigurationsOutletActions,
              private routerActions: RouterActions) {}
  
  getStoreElementData() {
    return StoreHelper.getStoreElementData();
  }
  
  getStatusElementData() {
    return {
      data: [
        {value: "AllStatus", label: "Choose your option"},
        {value: true, label: "Enable"},
        {value: false, label: "Disable"},
      ]
    };
  }
  
  getWarehouseElementData() {
    return {
      data: []
    };
  }
  
  getStoreById(id) {
    return StoreHelper.getStoreById(id);
  }
  
  updateFilter(filterData) {
    this.configurationsOutletActions.updateOutletFilter(filterData);
  }
  
  editOutlet(id) {
    this.routerActions.go('pos/configurations/default/pos/outlet/edit', id);
  }
}
