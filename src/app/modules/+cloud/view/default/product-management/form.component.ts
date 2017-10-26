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

@Component({
             // moduleId: module.id,
             selector: 'product-form',
             templateUrl: 'form.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush,
           })

export class ProductFormComponent extends AbstractSubscriptionComponent implements OnInit, AfterViewInit {
  public product = {
    pricings: [],
    versions: [],
    apiVersions: []
  };
  public prices = [];
  public data   = {};
  public users  = ['test@example.com', 'hihi@example.com', 'hehe@example.com']; // temporary

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
    // script for treeview
    $.fn.extend({
      treed: function (o) {
        let openedClass = 'glyphicon-minus-sign';
        let closedClass = 'glyphicon-plus-sign';
      
        if (typeof o !== 'undefined') {
          if (typeof o.openedClass !== 'undefined') {
            openedClass = o.openedClass;
          }
          if (typeof o.closedClass !== 'undefined') {
            closedClass = o.closedClass;
          }
        }
      
        // initialize each of the top levels
        let tree = $(this);
        tree.addClass("tree");
        tree.find('li').has("ul").each(function () {
          let branch = $(this); // li with children ul
          branch.prepend("<i class='indicator glyphicon " + closedClass + "'></i>");
          branch.addClass('branch');
          branch.on('click', function (e) {
            if (this == e.target) {
              let icon = $(this).children('i:first');
              icon.toggleClass(openedClass + " " + closedClass);
              $(this).children().children().toggle();
            }
          });
          branch.children().children().toggle();
        });
        // fire event from the dynamically added icon
        tree.find('.branch .indicator').each(function(){
          $(this).on('click', function () {
            $(this).closest('li').click();
          });
        });
        // fire event to open branch if the li contains an anchor instead of text
        tree.find('.branch>a').each(function () {
          $(this).on('click', function (e) {
            $(this).closest('li').click();
            e.preventDefault();
          });
        });
        // fire event to open branch if the li contains a button instead of text
        tree.find('.branch>button').each(function () {
          $(this).on('click', function (e) {
            $(this).closest('li').click();
            e.preventDefault();
          });
        });
        tree.find('li:not(.branch)').on('click', function () {
          let path = [];
          let end = false;
          let current = $(this);
          while (!end) {
            path.unshift(current.clone().children().remove().end().text());
            // console.log(current.clone().children().remove().end().text());
            if( current.parent().hasClass('tree') ) {
              end = true;
              break;
            }
            current = current.parent().parent();
          }
          $('#modal-version-path-display').text(path.toString().replace(/\s+/g, '').replace(/,/g, ' / '));
          $('#modal-version-path').val(path.toString().replace(/\s+/g, '').replace(/,/g, ' / '));
        });
      }
    });
    
    $('#tree1').treed({openedClass:'glyphicon-folder-open', closedClass:'glyphicon-folder-close'});
    // end: script for treeview
  }
  
  private initPageJs() {
    let vm          = this;
    this.product.apiVersions = ['1.1.0', '1.2.0', '1.2.1']; // temporary
    this.validation = jQuery('.js-validation-product')['validate']({
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
    
    jQuery("#val-pricings")['select2']();
    jQuery("#modal-version-api")['select2']();
    jQuery("#modal-version-specified-customers")['select2']();
    
    $(document).ready(() => {
      $(document).on('show.bs.modal','#modal-product-versions', () => {
        if( $('#modal-version-customers option:selected').val() === 'specified' ) {
          $('#modal-version-specified-customers').next().css('display', 'block');
        } else {
          $('#modal-version-specified-customers').next().css('display', 'none');
        }
      });
      
      $('#modal-version-customers').on('change', () => {
        if( $('#modal-version-customers option:selected').val() === 'specified' ) {
          $('#modal-version-specified-customers').next().css('display', 'block');
        } else {
          $('#modal-version-specified-customers').next().css('display', 'none');
        }
      });
    });
  }

  isEditingProduct() {
    return !!this.product && !!this.product['_id'];
  }

  goBack() {
    this.routerActions.go('cloud/default/product/list');
  }
  
  addVersion() {
    let versionId = $('#modal-version-id').val();
    let customer = {
      type: $('#modal-version-customers option:selected').val(),
      users: []
    };
    if($('#modal-version-customers option:selected').val() === 'specified') {
      customer.users = $('#modal-version-specified-customers').val();
    }
    
    if( versionId === '-1' ) {
      this.product.versions.push(
        {
          name: $('#modal-version-name').val(),
          version: $('#modal-version-version').val(),
          customers: customer,
          api: $('#modal-version-api').val(),
          path: $('#modal-version-path').val(),
          descriptions: $('#modal-version-descriptions').val(),
          created_at: moment().toDate(),
          updated_at: moment().toDate(),
        }
      );
    } else {
      this.product.versions[versionId] = {
        name: $('#modal-version-name').val(),
        version: $('#modal-version-version').val(),
        customers: customer,
        api: $('#modal-version-api').val(),
        path: $('#modal-version-path').val(),
        descriptions: $('#modal-version-descriptions').val(),
        created_at: moment().toDate(),
        updated_at: moment().toDate(),
      };
    }
  
    this.resetModalVersion();
  }
  
  editVersion(vIndex) {
    $('#modal-version-id').val(vIndex);
    $('#modal-version-name').val(this.product.versions[vIndex]['name']);
    $('#modal-version-version').val(this.product.versions[vIndex]['version']);
    $('#modal-version-customers').val(this.product.versions[vIndex]['customers']['type']);
    $('#modal-version-specified-customers').val(this.product.versions[vIndex]['customers']['users']).trigger('change');
    $('#modal-version-api').val(this.product.versions[vIndex]['api']).trigger('change');
    $('#modal-version-path').val(this.product.versions[vIndex]['path']);
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
    $('#modal-version-id').val(-1);
    $('#modal-version-name').val('');
    $('#modal-version-version').val('');
    $('#modal-version-customers').val('all');
    $('#modal-version-specified-customers').val('').trigger('change');
    $('#modal-version-api').val('').trigger('change');
    $('#modal-version-path').val('unset');
    $('#modal-version-path-display').text('unset');
    $('#modal-version-descriptions').val('');
    $('.close').click();
  }
}
