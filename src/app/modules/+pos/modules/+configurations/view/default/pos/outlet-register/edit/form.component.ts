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
import {AuthenticateService} from "../../../../../../../../../services/authenticate";
import {FormValidationService} from "../../../../../../../../share/provider/form-validation";
import {NotifyManager} from "../../../../../../../../../services/notify-manager";
import {UserCollection} from "../../../../../../../../../services/meteor-collections/users";

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
              private authenticate: AuthenticateService,
              private formValidation: FormValidationService,
              private notify: NotifyManager,
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
  
  saveOutlet() {
    if (this.authenticate.userCan('change_register_information')) {
      this.formValidation.submit('outlet_edit_address', () => {
        this.configurationsOutletActions.saveOutlet(this.getEditOutletFormData().outlet, this.getEditOutletFormData().registers);
      }, true);
    } else {
      this.notify.error("not_have_permission_to_change_outlet_register_information");
    }
  }
  
  getUserSelect() {
    let userCollection = new UserCollection();
    return userCollection.getUserSelect();
  }
  
  editRegister(register) {
    this.configurationsOutletActions.editRegister(register);
    this.routerActions.go('pos/configurations/default/pos/outlet/register-edit');
  }
}
