import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {ConfigurationsState} from "../../../../../R/index";
import {RouterActions} from "../../../../../../../../../R/router/router.actions";
import {ConfigurationsRegionService} from "../../../../../R/region/region.service";
import {PosEntitiesState} from "../../../../../../../R/entities/entities.state";
import {ActivatedRoute, ParamMap} from "@angular/router";
import {ConfigurationsRegionActions} from "../../../../../R/region/region.actions";

import {OutletHelper} from "../../../../../../../core/framework/outlet/Helper/OutletHelper";

import {AuthenticateService} from "../../../../../../../../../services/authenticate";
import {FormValidationService} from "../../../../../../../../share/provider/form-validation";
import {NotifyManager} from "../../../../../../../../../services/notify-manager";

@Component({
             // moduleId: module.id,
             selector: 'configurations-default-pos-region-edit-form',
             templateUrl: 'form.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })

export class ConfigurationsDefaultPosRegionEditFormComponent implements OnInit {
  @Input() configurationsState: ConfigurationsState;
  @Input() entitiesState: PosEntitiesState;
  
  viewState = {};
  viewData  = {};
  
  constructor(private routerActions: RouterActions,
              private configurationsRegionService: ConfigurationsRegionService,
              private configurationsRegionActions: ConfigurationsRegionActions,
              private authenticate: AuthenticateService,
              private formValidation: FormValidationService,
              private notify: NotifyManager,
              private route: ActivatedRoute) {
    this.viewState = {
      isOpenPopup: false,
    };
  }
  
  ngOnInit(): void {
    this.route.paramMap.map((params: ParamMap) => {
          return params.get('id');
        })
        .subscribe((regionId: any) => {
          this.configurationsRegionActions.editRegion(regionId);
        });
    
    if (!this.configurationsRegionService.editRegionFormData || !this.configurationsRegionService.editRegionFormData['id']) {
      this.routerActions.go('pos/configurations/default/pos/region/grid');
    }
  }
  
  back() {
    this.routerActions.go('pos/configurations/default/pos/region/grid');
  }
  
  getRegion() {
    return this.configurationsRegionService.editRegionFormData;
  }
  
  saveRegion() {
    this.formValidation.submit('region_edit_data', () => {
      this.configurationsRegionActions.saveRegion(this.getRegion());
    }, true);
    // if (this.authenticate.userCan('change_register_information')) {
    //   this.formValidation.submit('outlet_edit_address', () => {
    //     this.configurationsOutletActions.saveOutlet(this.getEditOutletFormData().outlet, this.getEditOutletFormData().registers);
    //   }, true);
    // } else {
    //   this.notify.error("not_have_permission_to_change_outlet_register_information");
    // }
  }
  
  getOutletSelect() {
    return OutletHelper.getOutletElementData();
  }
  
  confirmDeleteRegion() {
    this.openPopup("Are you sure you want to delete this region ? ", () => {
      this.configurationsRegionActions.deleteRegion(this.getRegion()['id']);
    });
  }
  
  openPopup(text: string, callBack: ()=>void) {
    this.viewData['popup_text']  = text;
    this.viewData['callBackYes']  = callBack;
    this.viewState['isOpenPopup'] = true;
  }
  
  callBackYes() {
    if (this.viewData['callBackYes']) {
      this.viewData['callBackYes']();
    }
  }
}
