import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AbstractSubscriptionComponent} from "../../../../../code/AbstractSubscriptionComponent";
import {LicenseCollection} from "../../../../../services/meteor-collections/licenses";
import {Observable} from "rxjs/Observable";
import {MongoObservable} from "meteor-rxjs";
import * as _ from 'lodash';
import {Store} from "@ngrx/store";
import {ShopManageState} from "../../../R/shop/state";
import {ShopManageActions} from "../../../R/shop/actions";

@Component({
             // moduleId: module.id,
             selector: 'roles-component',
             templateUrl: 'roles.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush,
           })

export class RolesComponent extends AbstractSubscriptionComponent implements OnInit, OnDestroy {
  @ViewChild('modalRole') protected modalRole;
  @ViewChild('modalDelete') protected modalDelete;
  
  public shopManageState$: Observable<ShopManageState>;
  public data = {
    isResolvedData: false
  };
  
  public role: Object = {
    code: null,
    name: null,
  };
  public roles: any[] = [];
  public license;
  private _vaidation: any;
  
  constructor(protected licenseCollection: LicenseCollection,
              protected changeDetectorRef: ChangeDetectorRef,
              protected shopMangeActions: ShopManageActions,
              protected store$: Store<any>) {
    super();
    this.shopManageState$ = this.store$.select('shopManage');
  }
  
  ngOnInit() {
    this.subscribeObservable('_', () =>
      Observable.combineLatest(
        this.licenseCollection.getCollectionObservable()
      ).subscribe((z: any) => {
        const licenseCollection: MongoObservable.Collection<any> = z[0];
        
        const licenses = licenseCollection.find().fetch();
        
        if (_.size(licenses) === 1) {
          this.license             = _.first(licenses);
          this.roles               = this.license['has_roles'];
          this.data.isResolvedData = true;
          this.changeDetectorRef.detectChanges();
          setTimeout(() => { this.initPageJs();}, 500);
        } else {
        
        }
      })
    );
  }
  
  private initPageJs() {
    let vm               = this;
    let initFormMaterial = () => {
      if (this._vaidation) {
        this._vaidation.destroy();
      }
      this._vaidation = jQuery('.js-validation-role')['validate']({
                                                                    errorClass: 'help-block text-right animated fadeInDown',
                                                                    errorElement: 'div',
                                                                    errorPlacement: (error, e) => {
                                                                      jQuery(e).parents('.form-group > div').append(error);
                                                                    },
                                                                    highlight: e => {
                                                                      const elem = jQuery(e);
          
                                                                      elem.closest('.form-group').removeClass('has-error').addClass('has-error');
                                                                      elem.closest('.help-block').remove();
                                                                    },
                                                                    success: e => {
                                                                      const elem = jQuery(e);
          
                                                                      elem.closest('.form-group').removeClass('has-error');
                                                                      elem.closest('.help-block').remove();
                                                                    },
                                                                    rules: {
                                                                      'name': {
                                                                        required: true
                                                                      },
                                                                      'code': {
                                                                        required: true
                                                                      }
                                                                    },
                                                                    messages: {
                                                                      'name': {
                                                                        required: 'Please enter role name',
                                                                      },
                                                                      'code': {
                                                                        required: 'Please enter code',
                                                                      }
                                                                    },
                                                                    submitHandler: () => {
                                                                      jQuery(vm.modalRole.nativeElement)['modal']('hide');
                                                                      this.shopMangeActions.saveRole(this.role);
                                                                    }
                                                                  });
    };
    initFormMaterial();
  }
  
  editRole(code?: string) {
    if (!!code) {
      this.role = _.find(this.roles, (rol) => {
        return rol['code'] === code;
      });
      if (this.role) {
        jQuery(this.modalRole.nativeElement)['modal']('show');
      }
    } else {
      this.role = {
        name: null,
        code: null
      };
      jQuery(this.modalRole.nativeElement)['modal']('show');
    }
  }
  
  deleteRole(code?: string) {
    if (!!code) {
      this.role = _.find(this.roles, (rol) => {
        return rol['code'] === code;
      });
      
      if (this.role) {
        jQuery(this.modalDelete.nativeElement)['modal']('show');
      }
    }
  }
  
  deleteRoleConfirm() {
    this.shopMangeActions.deleteRole(this.role);
    jQuery(this.modalDelete.nativeElement)['modal']('hide');
  }
  
  ngOnDestroy() {
    super.ngOnDestroy();
    if (this._vaidation) {
      this._vaidation.destroy();
    }
  }
}
