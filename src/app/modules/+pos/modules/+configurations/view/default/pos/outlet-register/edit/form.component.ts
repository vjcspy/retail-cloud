import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {ConfigurationsState} from "../../../../../R/index";
import {RouterActions} from "../../../../../../../../../R/router/router.actions";
import {ConfigurationsOutletService} from "../../../../../R/outlets/outlet.service";
import {PosEntitiesState} from "../../../../../../../R/entities/entities.state";
import {ActivatedRoute, ParamMap} from "@angular/router";
import {ConfigurationsOutletActions} from "../../../../../R/outlets/outlet.actions";
import {ReceiptHelper} from "../../../../../../../core/framework/receipt/Helper/ReceiptHelper";
import {StoreHelper} from "../../../../../../../core/framework/store/Helper/StoreHelper";
import {CountryHelper} from "../../../../../../../core/framework/directory/Helper/CountryHelper";

@Component({
             // moduleId: module.id,
             selector: 'configurations-default-pos-outlet-register-edit-form',
             templateUrl: 'form.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })

export class ConfigurationsDefaultPosOutletRegisterEditFormComponent implements OnInit {
  @Input() configurationsState: ConfigurationsState;
  @Input() entitiesState: PosEntitiesState;
  
  tabState: string = 'info';
  
  constructor(private routerActions: RouterActions,
              private configurationsOutletService: ConfigurationsOutletService,
              private configurationsOutletActions: ConfigurationsOutletActions,
              private route: ActivatedRoute) { }
  
  ngOnInit(): void {
    this.route.paramMap
        .switchMap((params: ParamMap) => params.get('id'))
        .subscribe((outletId: any) => {
          this.configurationsOutletActions.editOutlet(outletId);
        });
  }
  
  back() {
    this.routerActions.go('pos/configurations/default/pos/outlet/grid');
  }
  
  getStatusSelect() {
    return {
      data: [
        {value: true, label: "Enable"},
        {value: false, label: "Disable"}
      ]
    };
  }
  
  getEditOutletFormData() {
    return this.configurationsOutletService.editOutletFormData;
  }
  
  getReceiptTemplateSelect() {
    return ReceiptHelper.getReceiptTemplateSelect(this.entitiesState.receipts.items.toArray());
  }
  
  getStoreElementData() {
    return StoreHelper.getStoreElementData();
  }
  
  getCountrySelect() {
    return CountryHelper.getCountrySelect();
  }
  
  getRegionSelect(id) {
    return CountryHelper.getRegionSelect(id);
  }
}
