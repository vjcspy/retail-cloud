import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, AfterViewInit} from '@angular/core';
import {ProductCollection} from "../../../../../services/meteor-collections/products";
import {ActivatedRoute} from "@angular/router";
import {Observable} from "rxjs/Observable";
import {MongoObservable} from "meteor-rxjs";
import {NotifyManager} from "../../../../../services/notify-manager";
import {RouterActions} from "../../../../../R/router/router.actions";
import {PriceCollection} from "../../../../../services/meteor-collections/prices";
import * as moment from 'moment';
import * as _ from 'lodash';
import {ProductActions} from "../../../R/product/actions";
import {ProductState} from "../../../R/product/state";
import {Store} from "@ngrx/store";
import {AbstractSubscriptionComponent} from "../../../../../code/AbstractSubscriptionComponent";
import {UPLOAD_CLIENT_PACKAGE_URL} from '../../../../../../../config/constant.js';

@Component({
  // moduleId: module.id,
  selector:        'product-form',
  templateUrl:     'form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ProductFormComponent extends AbstractSubscriptionComponent implements OnInit, AfterViewInit {
  public product = {
    pricings:    [],
    versions:    [],
    apiVersions: []
  };
  public prices  = [];
  public data    = {};
  public users   = ['test@example.com', 'hihi@example.com', 'hehe@example.com']; // temporary
  
  protected validation;
  
  public productState$: Observable<ProductState>;
  
  constructor(public productCollection: ProductCollection,
              public priceCollection: PriceCollection,
              protected route: ActivatedRoute,
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
    ).subscribe((z: any) => {
      const params                                             = z[0];
      const productCollection: MongoObservable.Collection<any> = z[1];
      const priceCollection: MongoObservable.Collection<any>   = z[2];
      
      this.prices = priceCollection.find().fetch();
      
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
  
  private initPageJs() {
    let vm          = this;
    let apiUrl      = UPLOAD_CLIENT_PACKAGE_URL;
    this.validation = jQuery('.js-validation-product')['validate']({
      errorClass:   'help-block text-right animated fadeInDown',
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
      rules:        {
        'val-product_name': {
          required: true
        },
        'val-product_code': {
          required: true
        },
        'val-version_name': {
          required: true
        },
        'val-version':      {
          required: true
        },
        'val-pricings':     {
          required:  true,
          minlength: 1
        },
      },
      messages:     {
        'val-product_name': {
          required: 'Please enter product name',
        },
        'val-product_code': {
          required: 'Please enter product code',
        },
        'val-pricings':     {
          required: 'Please select at least choose one pricing',
        },
      },
      submitHandler() {
        let pricings = jQuery("#val-pricings").val();
        
        if (_.isArray(pricings)) {
          _.forEach(pricings, (pricing_id) => {
            if (_.isArray(vm.product['has_pricing'])) {
              vm.product['has_pricing'].push({pricing_id});
            } else {
              vm.product['has_pricing'] = [];
            }
          });
        } else {
          vm.notify.error("wrong_format_pricing");
          return;
        }
        
        vm.productActions.saveProduct(vm.product);
      }
    });
    
    $('#product-version')['validate']({
      errorClass:   'help-block text-left animated fadeInDown',
      errorElement: 'div',
      highlight(e) {
        $(e).closest('tr').removeClass('has-error').addClass('has-error');
        $(e).closest('.help-block').remove();
      },
      success(e) {
        $(e).closest('tr').removeClass('has-error');
        $(e).closest('.help-block').remove();
      },
      rules:        {
        'modal-version-version': {
          required: true,
          pattern: /^[0-9]{1}.[0-9]{1,2}.[0-9]{1,2}$/
        }
      },
      submitHandler() {
        let versionId = $('#modal-version-id').val();
        let customer  = {
          type:  $('#modal-version-customers option:selected').val(),
          users: []
        };
        if ($('#modal-version-customers option:selected').val() === 'specified') {
          customer.users = $('#modal-version-specified-customers').val();
        }
        
        let path = '';
        if (versionId === '-1') {
          let file = $('#modal-version-path')[0].files[0];
          if (typeof(file) != 'undefined') {
            let formData = new FormData();
            formData.append('fileAbc', file, file.name);
            
            // uploadFile(data, updateProduct())
            $.ajax({
              url:         apiUrl,
              type:        'POST',
              data:        formData,
              cache:       false,
              dataType:    'json',
              processData: false, // Don't process the files
              contentType: false, // Set content type to false as jQuery will tell the server its a query string request
              success:     function (data, textStatus, jqXHR) {
                path = data.data.path;
                
                vm.product.versions.push(
                  {
                    name:         $('#modal-version-name').val(),
                    version:      $('#modal-version-version').val(),
                    customers:    customer,
                    api:          $('#modal-version-api').val(),
                    path:         path,
                    descriptions: $('#modal-version-descriptions').val(),
                    apiVersions:  {},
                    created_at:   moment().toDate(),
                    updated_at:   moment().toDate(),
                  }
                );
                vm.changeDetectorRef.detectChanges();
                vm.disableLoadingModal();
                $('.close').click();
              },
              error:       function (jqXHR, textStatus, errorThrown) {
                console.log('error: ', textStatus);
              }
            };
          }
        } else {
          let file = $('#modal-version-path')[0].files[0];
          if (typeof(file) != 'undefined') {
            let formData = new FormData();
            formData.append('fileAbc', file, file.name);
            
            // uploadFile(data, updateProduct())
            $.ajax({
              url:         apiUrl,
              type:        'POST',
              data:        formData,
              cache:       false,
              dataType:    'json',
              processData: false, // Don't process the files
              contentType: false, // Set content type to false as jQuery will tell the server its a query string request
              success:     function (data, textStatus, jqXHR) {
                path = data.data.path;
                
                vm.product.versions[versionId].name         = $('#modal-version-name').val();
                vm.product.versions[versionId].version      = $('#modal-version-version').val();
                vm.product.versions[versionId].customers    = customer;
                vm.product.versions[versionId].api          = $('#modal-version-api').val();
                vm.product.versions[versionId].path         = path;
                vm.product.versions[versionId].descriptions = $('#modal-version-descriptions').val();
                vm.product.versions[versionId].updated_at   = moment().toDate();
                
                vm.changeDetectorRef.detectChanges();
                vm.disableLoadingModal();
                $('.close').click();
              },
              error:       function (jqXHR, textStatus, errorThrown) {
                console.log('error: ', textStatus);
              }
            };
          } else {
            // updateProduct()
            
            vm.product.versions[versionId].name         = $('#modal-version-name').val();
            vm.product.versions[versionId].version      = $('#modal-version-version').val();
            vm.product.versions[versionId].customers    = customer;
            vm.product.versions[versionId].api          = $('#modal-version-api').val();
            vm.product.versions[versionId].descriptions = $('#modal-version-descriptions').val();
            vm.product.versions[versionId].updated_at   = moment().toDate();
            
            vm.changeDetectorRef.detectChanges();
            vm.disableLoadingModal();
            $('.close').click();
          }
        }
        
        vm.loadingModal();
      }
    );
    
    jQuery("#val-pricings")['select2']();
    jQuery("#modal-version-api")['select2']();
    jQuery("#modal-version-specified-customers")['select2']();
    
    $(document).ready(() => {
      $(document).on('show.bs.modal', '#modal-product-versions', () => {
        if ($('#modal-version-customers option:selected').val() === 'specified') {
          $('#modal-version-specified-customers').next().css('display', 'block');
        } else {
          $('#modal-version-specified-customers').next().css('display', 'none');
        }
      });
      
      $('#modal-version-customers').on('change', () => {
        if ($('#modal-version-customers option:selected').val() === 'specified') {
          $('#modal-version-specified-customers').next().css('display', 'block');
        } else {
          $('#modal-version-specified-customers').next().css('display', 'none');
        }
      });
    });
    
    vm.changeDetectorRef.detectChanges();
  }
  
  loadingModal() {
    $('button.modal-add-version').addClass('disabled');
    $('button.modal-add-version').append(' <i class="fa fa-spinner fa-spin"></i>');
  }
  
  disableLoadingModal() {
    $('button.modal-add-version').removeClass('disabled');
    $('button.modal-add-version').text('Save');
  }
  
  isEditingProduct() {
    return !!this.product && !!this.product['_id'];
  }
  
  goBack() {
    this.routerActions.go('cloud/default/product/list');
  }
  
  editVersion(vIndex) {
    this.resetModalVersion();
    
    $('#modal-version-id').val(vIndex);
    $('#modal-version-name').val(this.product.versions[vIndex]['name']);
    $('#modal-version-version').val(this.product.versions[vIndex]['version']);
    $('#modal-version-customers').val(this.product.versions[vIndex]['customers']['type']);
    $('#modal-version-specified-customers').val(this.product.versions[vIndex]['customers']['users']).trigger('change');
    $('#modal-version-api').val(this.product.versions[vIndex]['api']).trigger('change');
    $('#modal-version-path').removeAttr('required');
    $('#modal-version-path-display').text(this.product.versions[vIndex]['path']);
    $('#modal-version-descriptions').val(this.product.versions[vIndex]['descriptions']);
  }
  
  removeVersion(version) {
    _.remove(this.product.versions, version);
  }
  
  isSelectedPrice(id) {
    return _.isArray(this.product['has_pricing']) && _.indexOf(this.product['has_pricing'].map((_p) => _p['pricing_id']), id) > -1;
  }
  
  resetModalVersion() {
    this.disableLoadingModal();
    
    $('#modal-version-id').val(-1);
    $('#modal-version-name').val('');
    $('#modal-version-version').val('');
    $('#modal-version-customers').val('all');
    $('#modal-version-specified-customers').val('').trigger('change');
    $('#modal-version-api').val('').trigger('change');
    $('#modal-version-path').val('');
    $('#modal-version-path-display').text('unset');
    $('#modal-version-descriptions').val('');
    $('.close').click();
  }
}
