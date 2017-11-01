import {ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {PosConfigState} from "../../../R/config/config.state";
import {ReceiptState} from "../../R/sales/receipts/receipt.state";
import * as _ from 'lodash';
import {CountryHelper} from "../../../core/framework/directory/Helper/CountryHelper";
import {AbstractSubscriptionComponent} from "../../../../../code/AbstractSubscriptionComponent";
import {ReceiptService} from "../../R/sales/receipts/receipt.service";
import {NotifyManager} from "../../../../../services/notify-manager";
import * as JsBarcode from 'jsbarcode';
import {ReceiptActions} from "../../R/sales/receipts/receipt.actions";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-receipt',
             templateUrl: 'receipt.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesReceiptComponent extends AbstractSubscriptionComponent implements OnInit {
  @ViewChild('receiptElem') receiptElem: ElementRef;
  @Input() posConfigState: PosConfigState;
  @Input() receiptState: ReceiptState;

  protected _data = {
    productOptions: {
      customOptions: {},
      configurableOption: {},
      bundleChildren: {}
    }
  };

  constructor(private receiptService: ReceiptService, private notify: NotifyManager, private receiptActions: ReceiptActions) {
    super();
  }

  ngOnInit() {
    this.subscribeObservable('print_receipt', () => {
      return this.receiptService.getReceiptObservable()
                 .debounceTime(300)
                 .subscribe(() => {
                   this.initBarcode();
                   if (['receipt', 'gift'].indexOf(this.receiptState.salesReceipt.typePrint) > -1) {
                     this.print();
                   } else if (this.receiptState.salesReceipt.typePrint === 'email') {
                     this.receiptActions.resolvedEmailReceipt(this.getHtml());
                   }
                 });
    });
  }

  protected print() {
    let myWindow = window.open('', '', 'width=600,height=800');
    if (myWindow) {
      myWindow.document.write(this.getHtml());
      myWindow.document.close();
      myWindow.focus();
      setTimeout(() => {
        myWindow.print();
        myWindow.close();
      }, 1000);
    } else {
      this.notify.info("allow_new_page_print_receipt");
    }
  }

  getReceiptSetting(): Object {
    return this.posConfigState.receipt;
  }

  getOrder(): Object {
    return this.receiptState.salesReceipt.orderOffline;
  }

  checkoutAsGuest(): boolean {
    if (this.getOrder().hasOwnProperty('customer')) {
      return parseInt(this.getOrder()['customer']['id']) === parseInt(this.posConfigState.setting.customer.getDefaultCustomerId());
    } else {
      return false;
    }
  }

  getUserNameById(id) {
    return "Unknow";
    // return this.userCollection.getUserNameById(id);
  }

  checkIsCustomSales(item) {
    return !!item['buy_request']['custom_sale'];
  }

  checkDecimalsQtyItems(item, isRefund = false) {
    if (!!isRefund) {
      return !Number.isInteger(item['qty_refunded'] || 0);
    }
    return !Number.isInteger(item['qty_ordered'] || 0);
  }

  getConfigurableOption(item) {
    if (!this._data['productOptions']['configurableOption'].hasOwnProperty(item['id'])) {
      if (item['product_options'].hasOwnProperty('attributes_info')) {
        this._data['productOptions']['configurableOption'][item['id']] = "";
        let _f                                                         = true;
        _.forEach(item['product_options']['attributes_info'], (option) => {
          this._data['productOptions']['configurableOption'][item['id']] +=
            _f ? option['label'] + ": " + option['value'] : " - " + option['label'] + ": " + option['value'];
        });
      } else {
        this._data['productOptions']['configurableOption'][item['id']] = false;
      }
    }
    return this._data['productOptions']['configurableOption'][item['id']];
  }

  // FIX XRT 1318 : remove qty for bundle father row
  isBundleProduct(item) {
    if (item['type_id'] === 'bundle') {
      return true;
    }
    return false;
  }

  getBundleChildren(item) {
    if (item['type_id'] === 'bundle' && _.isArray(item['children'])) {
      this._data['productOptions']['bundleChildren'][item['id']] = item['children'];
    } else {
      this._data['productOptions']['bundleChildren'][item['id']] = [];
    }
    return this._data['productOptions']['bundleChildren'][item['id']];
  }

  getProductCustomOption(item) {
    if (item['product_options'].hasOwnProperty('options')) {
      this._data['productOptions']['customOptions'][item['id']] = "";
      let _f                                                    = true;
      _.forEach(item['product_options']['options'], (option) => {
        this._data['productOptions']['customOptions'][item['id']] +=
          _f ? option['label'] + ": " + option['value'] : " - " + option['label'] + ": " + option['value'];
      });
    } else {
      this._data['productOptions']['customOptions'][item['id']] = false;
    }
    return this._data['productOptions']['customOptions'][item['id']];
  }

  showDiscountOrShipment(value) {
    return !!this.getReceiptSetting()['order_info']['discount_shipment'] || parseFloat(value) !== 0;
  }

  getPaymentTitle(payment) {
    if (payment['type'] === 'credit_card') {
      return payment['title'] + (parseInt(payment['is_purchase']) === 0 ? " Refund" : "") + (payment['data'] && !!payment['data']['ref'] ?
          (": Ref# " + payment['data']['ref']) :
          "");
    } else {
      return payment['title'] + (parseInt(payment['is_purchase']) === 0 ? " Refund" : "");
    }
  }

  getDiscount() {
    return (this.getOrder()['totals']['discount'] ?
        parseFloat(this.getOrder()['totals']['discount']) :
        0) + ((this.posConfigState.posRetailConfig.inclDiscountPerItemInDiscount === true && this.getOrder()['totals']['retail_discount_pert_item']) ?
        parseFloat(this.getOrder()['totals']['retail_discount_pert_item']) :
        0);
  }

  protected getRemainingData() {
    if (!this.getOrder().hasOwnProperty('remain')) {
      let paid = 0;
      _.forEach(this.getOrder()['payment'], (p) => {
        if (parseInt(p['is_purchase']) === 1 || p['is_purchase'] === true) {
          paid += parseFloat(p['amount']);
        }
      });
      this.getOrder()['remain'] = paid;
    }
    return this.getOrder()['totals']['grand_total'] - this.getOrder()['remain'];
  }

  showRemaining() {
    let remainData = this.getRemainingData();
    return !!remainData && (remainData <= -0.01 || remainData >= 0.01);

  }

  getRegionSelectedByCountryId(countryId, regionId) {
    return CountryHelper.getRegionSelected(countryId, regionId);
  }

  getCountryNameFromId(country_id: string) {
    if (!this.getOrder().hasOwnProperty(country_id)) {
      let arr = _.filter(CountryHelper.getCountrySelect()['data'], (value, key) => {
        return value['value'] == country_id;

      });
      if (arr) {
        this.getOrder()[country_id] = arr[0]['label'];
      } else {
        this.getOrder()[country_id] = country_id;
      }
    }
    return this.getOrder()[country_id];
  }

  protected initBarcode() {
    if (!this.getReceiptSetting()['enable_barcode']) {
      return;
    }

    if (this.getReceiptSetting()['barcode_symbology']) {
      let defaultWidth  = 2;
      let defaultHeight = 75;
      if (_.indexOf(["CODE128"], this.getReceiptSetting()['barcode_symbology']) > -1) {
        defaultWidth  = 1.5;
        defaultHeight = 75;
      } else if (_.indexOf(["CODE39"], this.getReceiptSetting()['barcode_symbology']) > -1) {
        defaultWidth  = 1;
        defaultHeight = 75;
      } else if (_.indexOf(["CODE128A", "CODE128B"], this.getReceiptSetting()['barcode_symbology']) > -1) {
        defaultWidth  = 1.5;
        defaultHeight = 75;
      }
      JsBarcode("#barcode1", this.getOrder()['retail_id'], {
        format: this.getReceiptSetting()['barcode_symbology'],
        width: defaultWidth,
        height: defaultHeight,
        displayValue: true
      });
    } else {
      JsBarcode("#barcode1", this.getOrder()['retail_id'], {
        format: 'CODE128',
        width: 1.8,
        height: 75,
        displayValue: true
      });
    }
  }

  protected getHtml() {
    return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta content="telephone=no" name="format-detection">
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,600,700,800" rel="stylesheet">
    <title></title>
    <style type="text/css">
            body{
                -webkit-text-size-adjust: 100% !important;
                -ms-text-size-adjust: 100% !important;
                -webkit-font-smoothing: antialiased !important;
                font-family: 'Open Sans', sans-serif;
                font-weight: 400; color: #000 !important;
                margin: 0; padding: 10px 0;
                 background:none !important;
            }
            img{
                border: 0; vertical-align: middle;
                outline: none;
            }
            p{
                margin: 0;
                padding: 0;
            }
            table{
                border-collapse: collapse;
                mso-table-lspace: 0;
                mso-table-rspace: 0;
            }
            td, a, span{
                border-collapse: collapse;
                mso-line-height-rule: exactly;
            }
            h1, h2, h3, h4 {font-weight: 700;}
            .c-left {text-align: left!important;}
            .c-right {text-align: right!important;}
            .c-center {text-align: center!important;}
            .invoice {
                max-width: 420px; margin: 0 auto;
                background: #FFF;
                /*border-radius: 10px;*/
                padding-right: 15px;
                padding-left: 3px;
            }
            .top-br, .bottom-br {text-align: center;}
            .top-br img {
				max-width: 100%; height: auto;
        border-radius: 10px 10px 0 0;
			}
            .bottom-br {font-size: 14px; padding: 12px 10px 10px;}
            .bottom-br p {margin: 0 0 12px; font-size: 11px;}
            .bottom-br .footer-img {
              background: #88E3A4;
              margin: 10px 0 15px;
              text-align: center;
            }
            .bottom-br .footer-img img {
              max-width: 100%; height: auto
            }

            .bottom-br .copy-right {font-size: 11px; color: #818181; margin: 0;}
			.bottom-br .bar-code {width: 54.75%; height: auto;}
            .inner {padding: 20px 0 0;}
            .inner h2, .inner h3 {margin: 0;}
            .inner h2 {font-weight: 800; font-size: 18px; text-align: center; margin-top: 0;}
            .client-info {
                position: relative;
                font-size: 11px; line-height: normal;
                margin: 20px 0 10px;

            }
            .client-info h3 {font-size: 11px;}
            .client-info p {margin: 0;}
            .client-info p.email {word-wrap: break-word; }
            /*.name, .email {padding-right: 100px;}*/
			.name span {display: inline-block; width: 100%;}
			.name span,
            /*.email {white-space: nowrap; overflow: hidden; text-overflow: ellipsis;}*/
            .timer {
                /*position: absolute;*/
                /*top: 0; right: 0;*/
                text-align: left;
                
            }
            /*.timer span {display: block; white-space: nowrap;}*/

            .invoice-table {border: #4F4F4F solid 2px; border-width: 2px 0;}
            .invoice-table th, .invoice-table h4 {font-size: 12px;}
            .invoice-table td {font-size: 12px; }
            /*.invoice-table td.c-left {font-size: 10px;}*/
            .invoice-table h4 {margin: 0;}
            .invoice-table th, .invoice-table td {
                padding: 0; text-align: center;
            }
            .invoice-table th {
                font-weight: 400;
                text-transform: none; padding-top: 9px; padding-bottom: 8px;
                border-bottom: #A7A7A7 solid 1px;
            }
            .invoice-table tbody tr:first-child td {padding-top: 5px;}
            .invoice-table tbody tr:last-child td {padding-bottom: 5px;}
            .invoice-table tbody.last tr:last-child td {padding-bottom: 12px;}
            .invoice-table tfoot.grand-total tr:first-child td {border-top: #4F4F4F solid 2px;}
            .invoice-table tfoot.grand-total tr:last-child td {border-bottom: #A7A7A7 solid 1px;}
            /*.invoice-table tfoot.grand-total tr:last-child td:first-child {border-bottom-color: transparent;}*/
            .invoice-table tfoot tr:first-child td {padding-top: 2px;}
            .invoice-table tfoot tr:last-child td {padding-bottom: 2px;}
            .invoice-table tfoot.grand-total tr:last-child td {padding: 5px 0;}

            .invoice-merchant{
              display: block;
              text-align: center;
              max-width: 420px;
              margin: 10px auto;
              padding-top: 20px;
              border-top: #4F4F4F dotted 3px;

            }
            .invoice-merchant pre{
              font-family: 'Open Sans', sans-serif;
              display: inline-block;
              font-size: 12px;
              text-align: left;
            }
            
      </style>
      
      
</head>
  
  <body>
  ${jQuery(this.receiptElem.nativeElement).html()}
  ${this.receiptState.salesReceipt.merchantReceipt ?
      `<div class="invoice-merchant"><pre>` + this.receiptState.salesReceipt.merchantReceipt + `</pre></div>` : ``}
  ${this.receiptState.salesReceipt.customerReceipt ?
      `<div class="invoice-merchant"><pre>` + this.receiptState.salesReceipt.customerReceipt + `</pre></div>` : ``}
  </body>
</html>`;
  }
}
