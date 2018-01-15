import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, AfterViewInit} from '@angular/core';
import {ProductCollection} from "../../../../../services/meteor-collections/products";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable} from "rxjs/Observable";
import {MongoObservable} from "meteor-rxjs";
import {NotifyManager} from "../../../../../services/notify-manager";
import {RouterActions} from "../../../../../R/router/router.actions";
import {PriceCollection} from "../../../../../services/meteor-collections/prices";
import {LicenseCollection} from "../../../../../services/meteor-collections/licenses";
import * as _ from 'lodash';
import {ProductActions} from "../../../R/product/actions";
import {ProductState} from "../../../R/product/state";
import {Store} from "@ngrx/store";
import {AbstractSubscriptionComponent} from "../../../../../code/AbstractSubscriptionComponent";
import {UPLOAD_CLIENT_PACKAGE_URL} from '../../../../../../../config/constant.js';
import {FileItem, FileUploader, ParsedResponseHeaders} from "ng2-file-upload";

@Component({
             // moduleId: module.id,
             selector: 'product-general',
             templateUrl: 'general.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush,
           })

export class ProductGeneralComponent extends AbstractSubscriptionComponent implements OnInit, AfterViewInit {
  public product        = {
    has_pricing: [],
    versions: [],
    api_versions: []
  };
  public products       = [];
  public prices         = [];
  public licenses       = [];
  public data           = {
    tabView: 'general'
  };
  public productVersion = {};
  public productVersionEdit = {};
  public productApi     = {};
  public productApiEdit = {};
  public productState$: Observable<ProductState>;
  public index;
  protected validation = {};
  public apiDelete;
  public versionDelete;
  public options: Object = {
        charCounterCount: true,
        toolbarButtons: ['bold', 'italic', 'underline', 'fontFamily', 'fontSize', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'insertTable', 'spellChecker', 'undo', 'redo'],
        toolbarButtonsXS: ['bold', 'italic', 'underline', 'paragraphFormat','alert'],
        toolbarButtonsSM: ['bold', 'italic', 'underline', 'paragraphFormat','alert'],
        toolbarButtonsMD: ['bold', 'italic', 'underline', 'paragraphFormat','alert'],
        height: 200,
  };
    
    connectPosUploader    = new FileUploader({
                                             url: 'https://demo.connectpos.com/upload',
                                             autoUpload: true,
                                             headers: [{name: "Access-Control-Allow-Origin", value: "*"}]
                                           });
  connectPosApiUploader = new FileUploader({
                                             url: 'https://demo.connectpos.com/api-upload',
                                             autoUpload: true,
                                             headers: [{name: "Access-Control-Allow-Origin", value: "*"}]
                                           });
  
  constructor(public productCollection: ProductCollection,
              public priceCollection: PriceCollection,
              public licenseCollection: LicenseCollection,
              protected route: ActivatedRoute,
              protected router: Router,
              protected changeDetectorRef: ChangeDetectorRef,
              protected notify: NotifyManager,
              protected routerActions: RouterActions,
              protected productActions: ProductActions,
              protected store$: Store<any>) {
    super();
    this.productState$ = this.store$.select('product');
  }
  
  ngOnInit() {
    this.subscribeObservable("_", () => Observable.combineLatest(
      this.route.params,
      this.productCollection.getCollectionObservable(),
      this.priceCollection.getCollectionObservable(),
      this.licenseCollection.getCollectionObservable(),
    ).subscribe((z: any) => {
      const params                                             = z[0];
      const productCollection: MongoObservable.Collection<any> = z[1];
      const priceCollection: MongoObservable.Collection<any>   = z[2];
      const licenseCollection: MongoObservable.Collection<any> = z[3];
      this.products = productCollection.find().fetch();
      this.prices   = priceCollection.find().fetch();
      this.licenses = licenseCollection.find().fetch();
      
      if (!!params['id']) {
        const product = productCollection.findOne({_id: params['id']});
        
        if (!!product) {
          this.product = product;
        } else {
          this.notify.error('can_not_find_product_with_id: ' + params['id']);
          this.goBack();
        }
      }
      this.changeDetectorRef.detectChanges();
      setTimeout(() => {
        this.initPageJs();
      }, 100);
    }));
  }
  
  ngAfterViewInit() {
  
  }
  
  protected initFileUploader() {
    this.connectPosUploader.onCompleteItem    = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
      try {
        const data = JSON.parse(response);
        if (!!data && !!data['path']) {
          this.productVersion['directory_path'] = data['path'];
          this.notify.success("upload_package_successfully");
          this.changeDetectorRef.detectChanges();
        } else {
          this.notify.error("upload_package_fail");
        }
      } catch (e) {
        this.notify.error("upload_package_fail");
      }
    };
    this.connectPosApiUploader.onCompleteItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
      try {
        const data = JSON.parse(response);
        if (!!data && !!data['path']) {
          this.productApi['directory_path'] = data['path'];
          
          this.notify.success("upload_package_successfully");
          this.changeDetectorRef.detectChanges();
        } else {
          this.notify.error("upload_package_fail");
        }
      } catch (e) {
        this.notify.error("upload_package_fail");
      }
    };
    
    this.connectPosUploader.onErrorItem    = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
      this.notify.error('can_not_upload_package');
    };
    this.connectPosApiUploader.onErrorItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
      this.notify.error('can_not_upload_package');
    };
  }
  
  private initPageJs() {
    let vm = this;
    this.initFileUploader();
    this.validation['productInfo'] = jQuery('#js-validation-product')['validate']({
                                                                                    errorClass: 'help-block text-right animated fadeInDown',
                                                                                    errorElement: 'div',
                                                                                    errorPlacement(error, e) {
                                                                                      jQuery(e).parents('.form-group > div').append(error);
                                                                                    },
                                                                                    highlight(e) {
                                                                                      let elem = jQuery(e);
        
                                                                                      elem.closest('.form-group')
                                                                                          .removeClass('has-error')
                                                                                          .addClass('has-error');
                                                                                      elem.closest('.help-block').remove();
                                                                                    },
                                                                                    success(e) {
                                                                                      let elem = jQuery(e);
        
                                                                                      elem.closest('.form-group').removeClass('has-error');
                                                                                      elem.closest('.help-block').remove();
                                                                                    },
                                                                                    rules: {
                                                                                      'val-product_name': {
                                                                                        required: true
                                                                                      },
                                                                                      'val-product_code': {
                                                                                        required: true
                                                                                      },
                                                                                      'val-version_name': {
                                                                                        required: true
                                                                                      },
                                                                                      'val-version': {
                                                                                        required: true
                                                                                      },
                                                                                      'val-pricings': {
                                                                                        required: true,
                                                                                        minlength: 1
                                                                                      },
                                                                                    },
                                                                                    messages: {
                                                                                      'val-product_name': {
                                                                                        required: 'Please enter product name',
                                                                                      },
                                                                                      'val-product_code': {
                                                                                        required: 'Please enter product code',
                                                                                      },
                                                                                      'val-pricings': {
                                                                                        required: 'Please select at least choose one pricing',
                                                                                      },
                                                                                    },
                                                                                    submitHandler: () => {
                                                                                      let pricings = jQuery("#val-pricings").val();
                                                                                      if (_.isArray(pricings)) {
                                                                                        vm.product['has_pricing'] = pricings.map((pricing_id) => {
                                                                                          return {pricing_id};
                                                                                        });
                                                                                      } else {
                                                                                        vm.notify.error("wrong_format_pricing");
                                                                                        return;
                                                                                      }
                                                                                      const productExist = _.find(this.products, (_p) => _p['code'] === vm.product['code'] && (_p)['_id'] !== vm.product['_id']);
                                                                                      if (!!productExist) {
                                                                                            vm.notify.error("Product_already_exist");
                                                                                            return;
                                                                                      }
                                                                                      vm.productActions.saveProduct(this.product);
                                                                                    }
                                                                                  });
    
    this.validation['productVersion'] = jQuery('#product-version')['validate']({
                                                                                 errorClass: 'help-block text-left animated fadeInDown',
                                                                                 errorElement: 'div',
                                                                                 highlight(e) {
                                                                                   $(e).closest('tr').removeClass('has-error').addClass('has-error');
                                                                                   $(e).closest('.help-block').remove();
                                                                                 },
                                                                                 success(e) {
                                                                                   $(e).closest('tr').removeClass('has-error');
                                                                                   $(e).closest('.help-block').remove();
                                                                                 },
                                                                                 rules: {
                                                                                   'product-version-version': {
                                                                                     required: true,
                                                                                     pattern: /^[0-9]{1}.[0-9]{1,2}.[0-9]{1,2}$/
                                                                                   },
                                                                                   'product-version-name': {
                                                                                     required: true
                                                                                   }
                                                                                 },
                                                                                 submitHandler: () => {
                                                                                   let licensesCompatible = jQuery('#version-specified-licenses')
                                                                                     .val();
                                                                                   let apiCompatible      = jQuery('#product-version-api-compatible').val();
                                                                                   if (this.productVersion['license_compatible_type'] === 'specified') {
                                                                                     if (_.isArray(licensesCompatible)) {
                                                                                       vm.productVersion['license_compatible'] = licensesCompatible.map((license_id) => {
                                                                                         return {license_id};
                                                                                       });
                                                                                     } else {
                                                                                       vm.notify.error("wrong_format_licensesCompatible");
                                                                                       return;
                                                                                     }
                                                                                   } else {
                                                                                     vm.productVersion['license_compatible'] = [];
                                                                                   }
                                                                                   if (_.isArray(apiCompatible)) {
                                                                                     vm.productVersion['api_compatible'] = apiCompatible.map((version) => {
                                                                                       return {version};
                                                                                     });
                                                                                   } else {
                                                                                     vm.notify.error("wrong_format_licensesCompatible");
                                                                                     return;
                                                                                   }
    
                                                                                   if (!this.productVersion['directory_path']) {
                                                                                         vm.notify.error("product_version_missing_directory_path");
                                                                                         return;
                                                                                   }
                                                                                   const versionDifferent = _.filter(this.product['versions'], (_vd) => { return (_vd) !== this.productVersionEdit; });
    
                                                                                   const versionExist = _.find(versionDifferent, (_pv) => _pv['version'] === vm.productVersion['version']);
                                                                                   if (!!versionExist) {
                                                                                         vm.notify.error("Version_product_already_exist");
                                                                                         return;
                                                                                   }
                                                                                   const index = _.indexOf(this.product.versions, this.productVersionEdit);
                                                                                   if (index === -1) {
                                                                                     vm.product.versions.push(this.productVersion);
                                                                                   } else {
                                                                                     vm.product.versions[index] = this.productVersion;
                                                                                   }
                                                                                   this.connectPosUploader.clearQueue();
                                                                                   jQuery('#product-version-package').val('');
                                                                                   jQuery('#modal-product-versions')['modal']('hide');
                                                                                   vm.changeDetectorRef.detectChanges();
                                                                                   vm.notify.success("product_version_save_success");
                                                                                 }
                                                                               });
    
    this.validation['productApi'] = jQuery('#product-api')['validate']({
                                                                         errorClass: 'help-block text-left animated fadeInDown',
                                                                         errorElement: 'div',
                                                                         highlight(e) {
                                                                           console.log(e);
                                                                           $(e).closest('tr').removeClass('has-error').addClass('has-error');
                                                                           $(e).closest('.help-block').remove();
                                                                         },
                                                                         success(e) {
                                                                           $(e).closest('tr').removeClass('has-error');
                                                                           $(e).closest('.help-block').remove();
                                                                         },
                                                                         rules: {
                                                                           'product-api-version': {
                                                                             required: true,
                                                                             pattern: /^[0-9]{1}.[0-9]{1,2}.[0-9]{1,2}$/
                                                                           },
                                                                           'product-api-name': {
                                                                             required: true,
                                                                           }
                                                                         },
                                                                         submitHandler: () => {
                                                                             
                                                                             if (!this.productApi['directory_path']) {
                                                                                 vm.notify.error("api_version_missing_directory_path");
                                                                                 return;
                                                                             }
                                                                             const versionApiDifferent = _.filter(this.product['api_versions'], (_vad) => { return (_vad) !== this.productApiEdit; });
                                                                             const versionApiExist = _.find(versionApiDifferent, (_av) => _av['version'] === vm.productApi['version']);
                                                                             if (!!versionApiExist) {
                                                                                 vm.notify.error("Version_api_already_exist");
                                                                                 return;
                                                                             }
                                                                             const index = _.indexOf(vm.product.api_versions, vm.productApiEdit);
                                                                             if (index === -1) {
                                                                             if (!_.isArray(vm.product['api_versions'])) {
                                                                               vm.product['api_versions'] = [];
                                                                             }
                                                                             vm.product['api_versions'].push(vm.productApi);
                                                                           } else {
                                                                                 vm.product['api_versions'][index] = vm.productApi;
                                                                             }
                                                                             this.connectPosApiUploader.clearQueue();
                                                                             jQuery('#product-api-package').val('');
                                                                             jQuery('#modal-product-api')['modal']('hide');
                                                                             vm.changeDetectorRef.detectChanges();
                                                                             vm.notify.success("api_version_save_success");
                                                                         }
                                                                       });
    
    jQuery("#val-pricings")['select2']();
  }
  
  goBack() {
    this.routerActions.go('cloud/default/product/list');
  }
  
  editVersion(pVersion: string) {
    if (pVersion === 'createNew') {
      if(!_.isArray(this.product['api_versions']) || this.product['api_versions'].length < 1) {
          this.notify.error("can_not_find_api_version_please_create_api_version_first");
          this.data.tabView = 'api';
          return;
      }
      this.productVersionEdit = {};
      this.productVersion = {};
      this.productVersion['license_compatible_type'] = 'all';
      jQuery('#product-version-api-compatible').val('');
      jQuery('#version-specified-licenses').val('');
    } else {
      this.productVersionEdit = _.find(this.product['versions'], (_pv) => _pv['version'] === pVersion);
      if (this.productVersionEdit) {
        this.productVersion                            = Object.assign({}, this.productVersionEdit);
        this.productVersion['license_compatible_type'] = _.size(this.productVersion['license_compatible']) > 0 ? 'specified' : 'all';
      } else {
        this.notify.error("can_not_find_version");
      }
    }
    jQuery('#modal-product-versions')['modal']('show');
    setTimeout(() => {
      jQuery("#product-version-api-compatible")['select2']();
      jQuery("#version-specified-licenses")['select2']();
    });
  }
  closeModalVersion() {
      jQuery('#modal-product-versions')['modal']('hide');
      this.validation['productVersion'].resetForm();
      jQuery('#product-version').find('.has-error').removeClass('has-error');
      this.productVersion = {};
      this.productVersion['descriptions'] = '';
      this.productVersion['changelog'] = '';
      jQuery('#product-version-api-compatible').val('');
      jQuery('#version-specified-licenses').val('');
      this.connectPosUploader.clearQueue();
      jQuery('#product-version-package').val('');
  }
  isSelectedLicenseCompatible(id) {
    return _.isArray(this.productVersion['license_compatible']) && _.indexOf(this.productVersion['license_compatible'].map((_v) => _v['license_id']), id) > -1;
  }
  
  isSelectedApi(version) {
    return _.isArray(this.productVersion['api_compatible']) && _.indexOf(this.productVersion['api_compatible'].map((_a) => _a['version']), version) > -1;
  }
  
  isSelectedPrice(id) {
    return _.isArray(this.product['has_pricing']) && _.indexOf(this.product['has_pricing'].map((_p) => _p['pricing_id']), id) > -1;
  }
  
  openPopupModalDeleteVersion(version) {
        this.versionDelete = version;
        $('#delete-version')['modal']('show');
  }
  
  closePopupModalDeleteVersion() {
        $('#delete-version')['modal']('hide');
    }
  removeVersion() {
    _.remove(this.product.versions, this.versionDelete);
    this.closePopupModalDeleteVersion();
  }
  
  editProductApi(productApiVersion: string) {
    if (productApiVersion === 'createNew') {
      this.productApiEdit = {};
      this.productApi = {};
    } else {
      this.productApiEdit = _.find(this.product['api_versions'], (_apiV) => _apiV['version'] === productApiVersion);
      
      if (this.productApiEdit) {
        this.productApi = Object.assign({}, this.productApiEdit);
      } else {
        this.notify.error("can_not_find_api_version");
      }
    }
    jQuery('#modal-product-api')['modal']('show');
  }
  closeModalApi() {
      jQuery('#modal-product-api')['modal']('hide');
      this.validation['productApi'].resetForm();
      jQuery('#modal-product-api').find('.has-error').removeClass('has-error');
      this.connectPosApiUploader.clearQueue();
      jQuery('#product-api-package').val('');
  }
  openPopupModalDeleteApi(api) {
        this.apiDelete = api;
        $('#delete-api')['modal']('show');
  }
  
  closePopupModalDeleteApi() {
        $('#delete-api')['modal']('hide');
  }
  removeProductApi() {
    const apiWasCompatible = _.find(this.product.versions, (_pv) => {
        return _.find(_pv['api_compatible'], (_pva) => _pva['version'] === this.apiDelete['version']);
    });
    if (apiWasCompatible) {
        this.notify.error("cannot_delete_api_was_compatible");
        this.closePopupModalDeleteApi();
        return;
    }
    _.remove(this.product['api_versions'], this.apiDelete);
    this.closePopupModalDeleteApi();
  }
  
  save() {
    jQuery('#js-validation-product').submit();
  }
}
