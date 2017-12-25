import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, AfterViewInit} from '@angular/core';
import {ProductCollection} from "../../../../../services/meteor-collections/products";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable} from "rxjs/Observable";
import {MongoObservable} from "meteor-rxjs";
import {NotifyManager} from "../../../../../services/notify-manager";
import {RouterActions} from "../../../../../R/router/router.actions";
import {PriceCollection} from "../../../../../services/meteor-collections/prices";
import {LicenseCollection} from "../../../../../services/meteor-collections/licenses";
import * as moment from 'moment';
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
  public prices         = [];
  public licenses       = [];
  protected version     = {};
  public type: String;
  protected versionId;
  protected apiVersion  = {};
  protected apiVersionId;
  protected jFormApi;
  protected validApi;
  protected jForm;
  protected validation;
  protected jFormVersion;
  protected validVersion;
  protected versionForAll;
  protected tab: string = 'general';
  public productState$: Observable<ProductState>;
  
  connectPosUploader = new FileUploader({
                                          url: 'http://lava.dev/upload',
                                          autoUpload: true,
                                          headers: [{name: "Access-Control-Allow-Origin", value: "*"}]
                                        });
  
  protected config;
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
    this.config = {toolbar :
          [
              { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'CopyFormatting', 'RemoveFormat' ] },
              { name: 'paragraph', items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight'] },
              { name: 'insert', items: [ 'Image', 'Flash', 'Table'] },
              '/',
              { name: 'styles', items: [ 'Styles', 'Format', 'Font', 'FontSize' ] },
              { name: 'colors', items: [ 'TextColor', 'BGColor' ] },
          ]};
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
    this.initFileUploader();
  }
  
  protected initFileUploader() {
    this.connectPosUploader.onCompleteItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
      const data = JSON.parse(response);
      if (!!data && !!data['path']) {
        this.version['directory_path'] = response['path'];
        this.notify.success("upload_package_successfully");
        this.changeDetectorRef.detectChanges();
      } else {
        this.notify.error("upload_package_fail");
      }
    };
    
    this.connectPosUploader.onErrorItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
      this.notify.error('can_not_upload_package');
    };
  }
  
  private initPageJs() {
    let vm          = this;
    this.jForm      = jQuery('.js-validation-product');
    this.validation = this.jForm['validate']({
                                               errorClass: 'help-block text-right animated fadeInDown',
                                               errorElement: 'div',
                                               errorPlacement(error, e) {
                                                 jQuery(e).parents('.form-group > div').append(error);
                                               },
                                               highlight(e) {
                                                 let elem = jQuery(e);
        
                                                 elem.closest('.form-group').removeClass('has-error').addClass('has-error');
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
                                             });
    
    this.jFormVersion = jQuery('#product-version');
    this.validVersion = this.jFormVersion['validate']({
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
                                                          'modal-version-version': {
                                                            required: true,
                                                            pattern: /^[0-9]{1}.[0-9]{1,2}.[0-9]{1,2}$/
                                                          }
                                                        },
                                                      });
    
    jQuery("#val-pricings")['select2']();
    // jQuery("#modal-version-api")['select2']();
    // jQuery("#modal-version-specified-licenses")['select2']();
    this.jFormApi = jQuery('#product-api');
    this.validApi = this.jFormApi['validate']({
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
                                                  'product-api-version': {
                                                    required: true,
                                                    pattern: /^[0-9]{1}.[0-9]{1,2}.[0-9]{1,2}$/
                                                  }
                                                },
                                              });
  }
  
  isEditingProduct() {
    return !!this.product && !!this.product['_id'];
  }
  
  goBack() {
    this.routerActions.go('cloud/default/product/list');
  }
  
  editVersion(vIndex) {
    // this.resetModalVersion();
    if (vIndex === -1) {
      this.type = 'all';
    } else {
      this.versionId = vIndex;
      this.version   = Object.assign({}, this.product.versions[this.versionId]);
      this.type      = this.product.versions[vIndex]['license_compatible'].length > 0 ? 'specified' : 'all';
    }
    jQuery('#modal-product-versions')['modal']('show');
  }
  
  isSelectedLicense(id) {
    return _.isArray(this.version['license_compatible']) && _.indexOf(this.version['license_compatible'].map((_v) => _v['license_id']), id) > -1;
  }
  
  isSelectedApi(version) {
    return _.isArray(this.version['api_compatible']) && _.indexOf(this.version['api_compatible'].map((_a) => _a['version']), version) > -1;
  }
  
  saveVersion() {
    if (this.jFormVersion.valid()) {
      let licensesCompatible = jQuery('#modal-version-specified-licenses').val();
      let apiCompatible      = jQuery('#modal-version-api').val();
      if (this.type === 'specified') {
        if (_.isArray(licensesCompatible)) {
          this.version['license_compatible'] = licensesCompatible.map((license_id) => {
            let rObj           = {};
            rObj['license_id'] = license_id;
            return rObj;
          });
        } else {
          this.notify.error("wrong_format_licensesCompatible");
          return;
        }
      } else {
        this.version['license_compatible'] = [];
      }
      if (_.isArray(apiCompatible)) {
        this.version['api_compatible'] = apiCompatible.map((version) => {
          let apiObj        = {};
          apiObj['version'] = version;
          return apiObj;
        });
      } else {
        this.notify.error("wrong_format_licensesCompatible");
        return;
      }
      if (this.versionId === -1) {
        this.version['directory_path'] = 'unknown';
        this.product.versions.push(this.version);
      } else {
        this.product.versions[this.versionId] = this.version;
      }
      this.closeVersionModal();
    }
  }
  
  removeVersion(version) {
    _.remove(this.product.versions, version);
  }
  
  isSelectedPrice(id) {
    return _.isArray(this.product['has_pricing']) && _.indexOf(this.product['has_pricing'].map((_p) => _p['pricing_id']), id) > -1;
  }
  
  resetModalVersion() {
    // this.disableLoadingModal();
    this.versionId = -1;
    this.version   = {};
    this.type      = 'all';
    jQuery('#modal-product-versions')['modal']('show');
  }
  
  closeVersionModal(): void {
    jQuery('#modal-product-versions')['modal']('hide');
  }
  
  showProductApi(index) {
    this.apiVersionId = index;
    this.apiVersion   = Object.assign({}, this.product['api_versions'][this.apiVersionId]);
    jQuery('#modal-product-api')['modal']('show');
  }
  
  resetModalApi() {
    this.apiVersion   = {};
    this.apiVersionId = -1;
    jQuery('#modal-product-api')['modal']('show');
  }
  
  removeProductApi(apiVersion) {
    _.remove(this.product['api_versions'], apiVersion);
  }
  
  saveProductApi() {
    if (this.jFormApi.valid()) {
      if (this.apiVersionId === -1) {
        this.apiVersion['directory_path'] = 'unknown';
        this.product['api_versions'].push(this.apiVersion);
      } else {
        this.product['api_versions'][this.apiVersionId] = this.apiVersion;
      }
      this.closeApiModal();
    }
  }
  
  closeApiModal(): void {
    jQuery('#modal-product-api')['modal']('hide');
  }
  
  saveProduct() {
    if (this.jForm.valid()) {
      let pricings = jQuery("#val-pricings").val();
      if (_.isArray(pricings)) {
        this.product['has_pricing'] = pricings.map((id) => {
          let rObj           = {};
          rObj['pricing_id'] = id;
          return rObj;
        });
      } else {
        this.notify.error("wrong_format_pricing");
        return;
      }
      this.versionForAll = _.find(this.product['versions'], (v) => {
        return v['license_compatible'].length < 1;
      });
      if (!this.versionForAll) {
        this.notify.error("Product need at least one version apply for all licenses");
        return false;
      }
      this.productActions.saveProduct(this.product);
      this.goBack();
    }
  }
  
  displayLicenses() {
    if (this.type === "specified") {
      return 'block';
    }
    return 'none';
  }
}
