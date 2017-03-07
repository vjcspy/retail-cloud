import {
  Component,
  OnInit
} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ProductCollection} from "../../../services/ddp/collections/products";
import {MongoObservable} from "meteor-rxjs";
import {ManageLicensesService} from "./manage-licenses.service";
import {LicenseCollection} from "../../../services/ddp/collections/licenses";
import {UserCollection} from "../../../services/ddp/collections/users";
import {PriceCollection} from "../../../services/ddp/collections/prices";
import * as _ from "lodash";

@Component({
             selector: 'license-form',
             templateUrl: 'form.html'
           })
export class LicenseFormComponent implements OnInit {
  id: string = "";
  protected form_title: string;
  protected license = {
    shop_owner_id: "",
    shop_owner_username: "",
    status: "",
    has_product: [],
  };
  protected product_ids_license: string[];
  protected base_urls: string[] = [];
  protected product_list: any[];
  protected products: Object[] = [];
  protected users: any;
  protected prices: any;
  protected currentProduct: any;
  protected options = {
    locale: {
      format: 'YYYY-MM-DD'
    },
    singleDatePicker: true,
    showDropdowns: true
  };
  protected product: any;
  protected has_product: Object[] = [];
  constructor(
    protected licenseService: ManageLicensesService,
    protected productCollection: ProductCollection,
    protected userCollection: UserCollection,
    protected priceCollection: PriceCollection,
    private route: ActivatedRoute,
    protected licenseCollection: LicenseCollection,
    protected router: Router
  ) {
    route.params.subscribe((p) => {
      this.id = p['id'];
      if(this.id){
        this.form_title = 'Edit License';
      }else{
        this.form_title = 'Add License';
      }
    });
  }

  ngOnInit() {
    this.licenseCollection.getCollectionObservable().subscribe(
      (collection: MongoObservable.Collection<any>) => {
        if (this.id){
          this.license = collection.findOne({_id: this.id});
          this.product_ids_license = _.map(this.license.has_product, (product) => {
            return product.product_id;
          });
        }
      }
    );

    this.productCollection.getCollectionObservable().subscribe(
      (collection: MongoObservable.Collection<any>) => {
        this.product_list = collection.find({}).fetch();
        _.forEach(this.product_list, (product) => {
          let object: any;
          if (this.product_ids_license.indexOf(product._id) > -1){
            object = {
              checked: true,
              name: product.name,
              product_id: product._id,
              status: "",
              start_version: "",
              versions: product.versions,
              pricing_id: "",
              based_urls: [],
              purchase_date: "",
              expired_date: ""
            };
          }else{
            object = {
              checked: false,
              name: product.name,
              product_id: product._id,
              status: "",
              start_version: "",
              versions: product.versions,
              pricing_id: "",
              based_urls: [],
              purchase_date: "",
              expired_date: ""
            };
          }
          this.products.push(object);
        });
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
                                                          let result = _.filter(vm.products, (product) => {
                                                            if (product['checked']){
                                                              return product;
                                                            }
                                                         });
                                                          if (vm.id){

                                                          }else{
                                                            vm.license = {
                                                              shop_owner_id: vm.license.shop_owner_id,
                                                              shop_owner_username: vm.license.shop_owner_username,
                                                              status: vm.license.status,
                                                              has_product: result
                                                            };
                                                            vm.licenseService.createLicense(vm.license);
                                                          }
                                                       }
                                                     });
    };
    initLicenseValidationMaterial();
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

  private selectedPurchaseDate(product, event){
    product['purchase_date'] = event.end._d;//
  }

  private selectedExpireDate(product, event){
    product['expired_date'] = event.end._d;
  }
}