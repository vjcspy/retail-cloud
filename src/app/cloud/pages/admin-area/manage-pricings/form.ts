import {
  Component,
  OnInit
} from '@angular/core';
import {ManageProductsService} from "./manage-products.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ProductCollection} from "../../../services/ddp/collections/products";
import {MongoObservable} from "meteor-rxjs";
import * as moment from 'moment';
import {PriceCollection} from "../../../services/ddp/collections/prices";
import {ToastsManager} from "ng2-toastr";
import {AbstractRxComponent} from "../../../../code/angular/AbstractRxComponent";
import {ManagePricingsService} from "./manage-pricings.service";

@Component({
             selector: 'pricing-form',
             templateUrl: 'form.html'
           })
export class PricingFormComponent extends AbstractRxComponent implements OnInit {
  id: string                      = "";
  protected prices: any;
  protected pricing               = {
    _id: "",
    name: ""
  };
  protected form_title: string;
  
  constructor(protected pricingService: ManagePricingsService,
              private route: ActivatedRoute,
              protected priceCollection: PriceCollection,
              protected router: Router,
              protected toast: ToastsManager) {
    super();
    route.params.subscribe((p) => {
      this.id = p['id'];
      if (this.id) {
        this.pricingService.viewState.headerText = this.form_title = 'Edit Pricing';
      } else {
        this.pricingService.viewState.headerText = this.form_title = 'Add Pricing';
      }
    });
  }
  
  ngOnInit() {
    this.priceCollection.getCollectionObservable().subscribe(
      (collection: MongoObservable.Collection<any>) => {
        if (this.id) {
          this.pricing = collection.findOne({_id: this.id});
        }
      }
    );
    this.initPageJs();
  }
  
  private initPageJs() {
    let vm                            = this;
    let initProductValidationMaterial = function () {
      jQuery('.js-validation-product-form').validate({
                                                       errorClass: 'help-block text-right animated fadeInDown',
                                                       errorElement: 'div',
                                                       errorPlacement: function (error, e) {
                                                         jQuery(e).parents('.form-group > div').append(error);
                                                       },
                                                       highlight: function (e) {
                                                         var elem = jQuery(e);
          
                                                         elem.closest('.form-group').removeClass('has-error').addClass('has-error');
                                                         elem.closest('.help-block').remove();
                                                       },
                                                       success: function (e) {
                                                         var elem = jQuery(e);
          
                                                         elem.closest('.form-group').removeClass('has-error');
                                                         elem.closest('.help-block').remove();
                                                       },
                                                       rules: {
                                                         'val-price_name': {
                                                           required: true
                                                         },
                                                       },
                                                       messages: {
                                                         'val-price_name': {
                                                           required: 'Please enter pricing name',
                                                         },
                                                       },
                                                       submitHandler: function (form) {
                                                         if (vm.id) {
                                                           vm.pricingService.editPricing(vm.pricing);
                                                         } else {
                                                           vm.pricingService.createPricing(vm.pricing);
                                                         }
                                                       }
                                                     });
    };
    initProductValidationMaterial();
  }
}
