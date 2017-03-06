import {
  Component,
  OnInit
} from '@angular/core';
import {ManageProductsService} from "./manage-products.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ProductCollection} from "../../../services/ddp/collections/products";
import {MongoObservable} from "meteor-rxjs";
import * as moment from 'moment';
import {ManageLicensesService} from "./manage-licenses.service";
import {LicenseCollection} from "../../../services/ddp/collections/licenses";
import {UserCollection} from "../../../services/ddp/collections/users";
import {PriceCollection} from "../../../services/ddp/collections/prices";

@Component({
             selector: 'edit-license',
             templateUrl: 'edit.html'
           })
export class EditLicenseComponent implements OnInit {
  id: string = "";
  protected base_urls: string[] = [];
  protected products: any;
  protected users: any;
  protected prices: any;
  protected license: any;
  protected currentProduct: any;
  protected options = {
    locale: {
      format: 'YYYY-MM-DD'
    },
    singleDatePicker: true,
    showDropdowns: true
  };
  protected has_product = {
    product_id: "",
    base_urls: this.base_urls,
    pricing_id: "",
    start_version: "",
    purchase_date: "",
    expired_date: ""
  };
  constructor(
    protected licenseService: ManageLicensesService,
    protected productCollection: ProductCollection,
    protected userCollection: UserCollection,
    protected priceCollection: PriceCollection,
    private route: ActivatedRoute,
    protected licenseCollection: LicenseCollection,
    protected router: Router
  ) {
    route.params.subscribe((p) => this.id = p['id']);
  }

  ngOnInit() {
    this.licenseCollection.getCollectionObservable().subscribe(
      (collection: MongoObservable.Collection<any>) => {
        this.license = collection.findOne({_id: this.id});
      }
    );

    this.productCollection.getCollectionObservable().subscribe(
      (collection: MongoObservable.Collection<any>) => {
        this.products = collection.find({}).fetch();
      }
    );

    this.userCollection.getCollectionObservable().subscribe(
      (collection: MongoObservable.Collection<any>) => {
        this.users = collection.find({}).fetch();
      }
    );

    this.priceCollection.getCollectionObservable().subscribe(
      (collection: MongoObservable.Collection<any>) => {
        this.prices = collection.find({}).fetch();
      }
    );
    this.initPageJs();
  }

  private initPageJs() {
    let vm = this;
    let initLicenseValidationMaterial = function () {
      jQuery('.js-validation-license-form').validate({
                                                       errorClass    : 'help-block text-right animated fadeInDown',
                                                       errorElement  : 'div',
                                                       errorPlacement: function (error, e) {
                                                         jQuery(e).parents('.form-group > div').append(error);
                                                       },
                                                       highlight     : function (e) {
                                                         var elem = jQuery(e);

                                                         elem.closest('.form-group').removeClass('has-error').addClass('has-error');
                                                         elem.closest('.help-block').remove();
                                                       },
                                                       success       : function (e) {
                                                         var elem = jQuery(e);

                                                         elem.closest('.form-group').removeClass('has-error');
                                                         elem.closest('.help-block').remove();
                                                       },
                                                       rules         : {
                                                         'val-status'        : {
                                                           required : true
                                                         }
                                                       },
                                                       messages      : {
                                                         'val-status'        : {
                                                           required : 'Please select status',
                                                         }
                                                       },
                                                       submitHandler: function (form) {
                                                         let license_change = {
                                                           _id: vm.id,
                                                           name: vm.license.key,
                                                           status: vm.license.status,
                                                           shop_owner_id: vm.license.shop_owner_id,
                                                           shop_owner_username: vm.license.shop_owner_username
                                                         };
                                                         vm.licenseService.editLicense(license_change);
                                                       }
                                                     });
    };
    let initProductValidationMaterial = function () {
      jQuery('.js-validation-product-form').validate({
                                                       ignore        : [],
                                                       errorClass    : 'help-block text-right animated fadeInDown',
                                                       errorElement  : 'div',
                                                       errorPlacement: function (error, e) {
                                                         jQuery(e).parents('.form-group > div').append(error);
                                                       },
                                                       highlight     : function (e) {
                                                         var elem = jQuery(e);

                                                         elem.closest('.form-group').removeClass('has-error').addClass('has-error');
                                                         elem.closest('.help-block').remove();
                                                       },
                                                       success       : function (e) {
                                                         var elem = jQuery(e);

                                                         elem.closest('.form-group').removeClass('has-error');
                                                         elem.closest('.help-block').remove();
                                                       },
                                                       rules         : {
                                                         'val-product': {
                                                           required: true
                                                         },
                                                         'val-version': {
                                                           required: true
                                                         },
                                                         'val-price': {
                                                           required: true
                                                         },
                                                         'val-purchased_date': {
                                                           required: true
                                                         },
                                                         'val-expired_date' : {
                                                           required: true
                                                         }
                                                       },
                                                       messages      : {
                                                         'val-product': {
                                                           required: 'Please select a product'
                                                         },
                                                         'val-version': {
                                                           required: 'Please select start version of product'
                                                         },
                                                         'val-price': {
                                                           required: 'Please select a pricing plan for product'
                                                         },
                                                         'val-purchased_date': {
                                                           required: 'Please enter purchase date'
                                                         },
                                                         'val-expired_date': {
                                                           required: 'Please enter expired date'
                                                         },
                                                       },
                                                       submitHandler: function (form) {
                                                         let data = {
                                                           _id: vm.id,
                                                           has_product: vm.has_product
                                                         };
                                                         vm.licenseService.addProduct(data);
                                                       }
                                                     });
    };
    initLicenseValidationMaterial();
    initProductValidationMaterial();
  }

  private onChange(event){
    this.productCollection.getCollectionObservable().subscribe(
      (collection: MongoObservable.Collection<any>) => {
        this.currentProduct = collection.findOne({_id: event.target.value});
      }
    );
  }

  private getOwnerName(event){
    this.userCollection.getCollectionObservable().subscribe(
      (collection: MongoObservable.Collection<any>) => {
        let shop_owner = collection.findOne({_id: event.target.value});
        if(shop_owner){
          this.license.shop_owner_username = shop_owner.username;
        }
      }
    );
  }

  private addBasedUrl(event){
    this.base_urls.push(event.target.value);
    event.target.value = "";
  }

  private selectedPurchaseDate(event){
    this.has_product.purchase_date = event.end._d;
  }

  private selectedExpireDate(event){
    this.has_product.expired_date = event.end._d;
  }
}
