import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {RouterActions} from "../../../../../../../../../../R/router/router.actions";
import {ConfigurationsOutletService} from "../../../../../../R/outlets/outlet.service";
import {FormValidationService} from "../../../../../../../../../share/provider/form-validation";
import {ConfigurationsOutletActions} from "../../../../../../R/outlets/outlet.actions";
import {ConfigurationsState} from "../../../../../../R/index";
import {DialogService} from "../../../../../../../../../dialog/dialog.service";
import {AuthenticateService} from "../../../../../../../../../../services/authenticate";
import {NotifyManager} from "../../../../../../../../../../services/notify-manager";

@Component({
             // moduleId: module.id,
             selector: 'configurations-default-pos-outlet-register-edit-register-form',
             templateUrl: 'form.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })

export class ConfigurationsDefaultPosOutletRegisterEditRegisterFormComponent implements OnInit {
  @Input() configurationsState: ConfigurationsState;
  
  constructor(private routerActions: RouterActions,
              private authenticate: AuthenticateService,
              private notify: NotifyManager,
              private configurationsOutletService: ConfigurationsOutletService,
              private formValid: FormValidationService,
              private configurationsOutletActions: ConfigurationsOutletActions,
              private dialogService: DialogService) {
  }
  
  ngOnInit(): void {
    if (!this.configurationsOutletService.editOutletFormData.outlet || !this.configurationsOutletService.editOutletFormData.outlet['id']) {
      this.routerActions.go('pos/configurations/default/pos/outlet/grid');
    }
  }
  
  getRegister() {
    return this.configurationsOutletService.editOutletFormData.register;
  }
  
  back() {
    const id = (this.configurationsOutletService.editOutletFormData.outlet && !!this.configurationsOutletService.editOutletFormData.outlet['id']) ?
      this.configurationsOutletService.editOutletFormData.outlet['id'] : 0;
    this.routerActions.go('pos/configurations/default/pos/outlet/edit', id);
  }
  
  saveRegister() {
    if (!this.authenticate.userCan('change_register_information') && this.getRegister().hasOwnProperty('id')) {
      this.notify.error("not_have_permission_to_change_outlet_register_information");
    } else {
      this.formValid.submit('register_edit_data', () => {
        this.configurationsOutletActions.saveRegister(this.getRegister());
      }, true);
    }
  }
  
  getStatusSelect() {
    return {
      data: [
        {value: true, label: "Enable"},
        {value: false, label: "Disable"}
      ]
    };
  }
  
  confirmDeleteRegister() {
    this.dialogService
        .title("are_you_sure_you_want_to_delete_this_register?")
        .whenYes(() => {
          this.configurationsOutletActions.deleteRegister(this.getRegister());
        })
        .confirm();
  }
}
