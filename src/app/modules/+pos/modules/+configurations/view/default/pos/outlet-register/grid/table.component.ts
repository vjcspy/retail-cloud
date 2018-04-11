import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {ConfigurationsState} from "../../../../../R/index";
import {StoreHelper} from "../../../../../../../core/framework/store/Helper/StoreHelper";
import {ConfigurationsOutletActions} from "../../../../../R/outlets/outlet.actions";
import {RouterActions} from "../../../../../../../../../R/router/router.actions";
import {PosEntitiesState} from "../../../../../../../R/entities/entities.state";
import {WarehouseHelper} from "../../../../../../../core/local/warehouse/Helper/WarehouseHelper";
import {RetailConfigService} from "../../../../../R/retail-config/retail-config.service";

@Component({
             // moduleId: module.id,
             selector: 'configurations-default-pos-outlet-register-grid-table',
             templateUrl: 'table.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })

export class ConfigurationsDefaultPosOutletRegisterGridTableComponent {
  @Input() configurationsState: ConfigurationsState;
  @Input() entitiesState: PosEntitiesState;
  constructor(private configurationsOutletActions: ConfigurationsOutletActions,
              private routerActions: RouterActions,
              public retailConfigService: RetailConfigService) {}
  
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
  
  getWarehouseSelect() {
      return WarehouseHelper.getWarehouseSelectData(this.entitiesState.warehouse.items.toArray());
  }
  
  getStoreById(id) {
    return StoreHelper.getStoreById(id);
  }
  
  getWarehouseById(id) {
        return WarehouseHelper.getWarehouseById(this.entitiesState.warehouse.items.toArray(),id);
    }
  
  updateFilter(filterData) {
    this.configurationsOutletActions.updateOutletFilter(filterData);
  }
  
  isIntegrateWh() {
      return this.retailConfigService.retailConfigSnapshot['pos']['xretail/pos/integrate_wh'] === 'bms';
  }
  
  editOutlet(id) {
    this.routerActions.go('pos/configurations/default/pos/outlet/edit', id);
  }
}
