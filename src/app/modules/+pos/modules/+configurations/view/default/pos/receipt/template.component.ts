import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {ReceiptHelper} from "../../../../../../core/framework/receipt/Helper/ReceiptHelper";
import {PosEntitiesState} from "../../../../../../R/entities/entities.state";
import {ConfigurationsReceiptState} from "../../../../R/receipts/receipt.state";
import {ConfigurationsReceiptActions} from "../../../../R/receipts/receipt.actions";
import {FileItem, FileUploader, ParsedResponseHeaders} from "ng2-file-upload";
import {ApiManager} from "../../../../../../../../services/api-manager";
import {PosGeneralState} from "../../../../../../R/general/general.state";
import {NotifyManager} from "../../../../../../../../services/notify-manager";
import * as _ from 'lodash';
import {FormValidationService} from "../../../../../../../share/provider/form-validation";

@Component({
             // moduleId: module.id,
             selector: 'configurations-default-pos-receipt-template',
             templateUrl: 'template.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })

export class ConfigurationsDefaultPosReceiptTemplateComponent implements OnInit {
  @Input() entitiesState: PosEntitiesState;
  @Input() configurationsReceiptState: ConfigurationsReceiptState;
  @Input() generalState: PosGeneralState;
  
  public logoImg: FileUploader;
  public footerImg: FileUploader;
  public isSavingImage: boolean = false;
  public froalaEditorOptions    = {
    toolbarButtons: [
      'bold',
      'italic',
      'underline',
      'strikeThrough',
      'subscript',
      'superscript',
      'fontFamily',
      'fontSize',
      'paragraphFormat',
      'align',
      'specialCharacters',
      'insertHR',
      'selectAll',
      'clearFormatting',
      'html',
      'undo',
      'redo'
    ],
  };
  
  constructor(private configurationsReceiptActions: ConfigurationsReceiptActions,
              private apiUrl: ApiManager,
              private notify: NotifyManager,
              private formValidation: FormValidationService) { }
  
  ngOnInit() {
    this.initFileUploader();
  }
  
  protected initFileUploader() {
    this.logoImg                  = new FileUploader({
                                                       url: this.apiUrl.getUploaderUrl(this.generalState.baseUrl),
                                                       autoUpload: true,
                                                       headers: [{name: "Access-Control-Allow-Origin", value: "*"}]
                                                     });
    this.footerImg                = new FileUploader({
                                                       url: this.apiUrl.getUploaderUrl(this.generalState.baseUrl),
                                                       autoUpload: true,
                                                       headers: [{name: "Access-Control-Allow-Origin", value: "*"}]
                                                     });
    this.footerImg.onProgressItem = this.logoImg.onProgressItem = () => {
      this.isSavingImage = true;
    };
    this.footerImg.onCompleteAll = this.logoImg.onCompleteAll = () => {
      this.isSavingImage = false;
    };
    // this.logoImg.onAfterAddingFile   = (fileItem: FileItem) => {
    // };
    // this.footerImg.onAfterAddingFile = (fileItem: FileItem) => {
    // };
    this.logoImg.onCompleteItem   = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
      this.configurationsReceiptState.receipt['logo_url'] = response;
      this.configurationsReceiptActions.selectReceipt(Object.assign({}, this.configurationsReceiptState.receipt));
    };
    this.footerImg.onCompleteItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
      this.configurationsReceiptState.receipt['footer_url'] = response;
      this.configurationsReceiptActions.selectReceipt(Object.assign({}, this.configurationsReceiptState.receipt));
    };
    this.footerImg.onErrorItem    =
      this.logoImg.onErrorItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
        this.notify.error('can_not_save_image');
      };
  }
  
  getReceiptSelectElem() {
    return ReceiptHelper.getReceiptTemplateSelect(this.entitiesState.receipts.items.toArray(), true);
  }
  
  selectReceipt(id) {
    let receipt: any;
    if (isNaN(id)) {
      receipt = {
        id: Date.now(),
        customer_info: '1',
        order_info: {
          shipping_address: true,
          sales_person: false,
          discount_shipment: false,
          reference_number: true,
        },
        row_total_incl_tax: true,
        logo_image_status: true,
        footer_image_status: true,
        subtotal_incl_tax: true,
        header: "X-POS",
        footer: "Thank you for shopping!",
        enable_barcode: true,
        barcode_symbology: 'CODE128',
        enable_power_text: true
      };
      
    } else {
      receipt = this.entitiesState.receipts.items.find((r) => parseInt(r['id']) === parseInt(id));
    }
    
    if (receipt) {
      this.configurationsReceiptActions.selectReceipt(receipt);
      setTimeout(() => {
        this.initBarcode();
      }, 250);
    }
  }
  
  getStatusImageSelectElem() {
    return {
      data: [
        {label: "Enable", value: 1},
        {label: "Disable", value: 0}
      ]
    };
  }
  
  getCustomerInfoSelectElem() {
    return {
      data: [
        {label: "Show email & phone number", value: 1},
        {label: "Show email only", value: 2},
        {label: "Show phone number only", value: 3},
        {label: "Don't show email & phone number", value: 4},
      ]
    };
  }
  
  getTotalElementSelectElem() {
    return {
      data: [
        {label: "Including tax", value: 1},
        {label: "Excluding tax", value: 2},
      ]
    };
  }
  
  onChangeBarcodeSymbology() {
    this.initBarcode();
  }
  
  getBarcodeSymbologyElemSelect() {
    return {
      data: [
        {label: "CODE128 auto", value: 'CODE128'},
        {label: "CODE128 A", value: 'CODE128A'},
        {label: "CODE128 B", value: 'CODE128B'},
        {label: "CODE39", value: 'CODE39'},
        {label: "MSI", value: 'MSI'},
        {label: "MSI10", value: 'MSI10'},
        {label: "MSI11", value: 'MSI11'},
        {label: "MSI1010", value: 'MSI1010'},
        {label: "MSI1110", value: 'MSI1110'},
      ]
    };
  }
  
  private initBarcode() {
    if (!this.configurationsReceiptState.receipt['enable_barcode']) {
      return;
    }
    
    if (this.configurationsReceiptState.receipt['barcode_symbology']) {
      let defaultWidth = 2;
      if (_.indexOf(["CODE39", "CODE128A", "CODE128B"], this.configurationsReceiptState.receipt['barcode_symbology']) > -1) {
        defaultWidth = 1;
      }
      JsBarcode("#barcode", "123456789123", {
        format: this.configurationsReceiptState.receipt['barcode_symbology'],
        width: defaultWidth,
        height: 75,
        displayValue: true
      });
    } else {
      JsBarcode("#barcode", "123456789123", {
        format: 'CODE128',
        width: 1.5,
        height: 75,
        displayValue: true
      });
    }
  }
  
  saveReceipt() {
    this.formValidation.submit('retail-receipt', async () => {
      this.configurationsReceiptActions.saveReceipt(this.configurationsReceiptState.receipt);
    }, true);
  }
}
