import {DataObject} from "../../General/DataObject";
import {SettingManagement} from "../../setting/SettingManagement";
import {ObjectManager} from "../../General/App/ObjectManager";
import {Customer} from "../../customer/Model/Customer";
import {EventManager} from "../../General/Event/EventManager";
import {Calculation as ResourceCalculation} from "./ResourceModel/Calculation";
import {StoreManager} from "../../store/Model/StoreManager";
import {Quote} from "../../quote/Model/Quote";
import {SessionQuote} from "../../Backend/Model/Session/Quote";

export class Calculation extends DataObject {
  /*
   * Identifier constant for Tax calculation before discount excluding TAX
   */
  static CALC_TAX_BEFORE_DISCOUNT_ON_EXCL = '0_0';
  /***/
  
  /**
   * Identifier constant for Tax calculation before discount including TAX
   */
  static CALC_TAX_BEFORE_DISCOUNT_ON_INCL = '0_1';
  
  /**
   * Identifier constant for Tax calculation after discount excluding TAX
   */
  static CALC_TAX_AFTER_DISCOUNT_ON_EXCL = '1_0';
  
  /**
   * Identifier constant for Tax calculation after discount including TAX
   */
  static CALC_TAX_AFTER_DISCOUNT_ON_INCL = '1_1';
  
  /**
   * CALC_UNIT_BASE
   */
  static CALC_UNIT_BASE = 'UNIT_BASE_CALCULATION';
  
  /**
   * CALC_ROW_BASE
   */
  static CALC_ROW_BASE = 'ROW_BASE_CALCULATION';
  
  /**
   * CALC_TOTAL_BASE
   */
  static CALC_TOTAL_BASE = 'TOTAL_BASE_CALCULATION';
  
  private _customer;
  static _rateCache: Object              = {};
  static _rateCalculationProcess: Object = {};
  private _resourceCalculation;
  
  getRateRequest(shippingAddress: any  = null,
                 billingAddress: any   = null,
                 customerTaxClass: any = null,
                 store: any            = null) {
    if (shippingAddress === false && billingAddress === false && customerTaxClass === false) {
      return this.getRateOriginRequest(store);
    }
    let address  = new DataObject();
    let customer = this.getCustomer();
    let baseOn   = this.getSetting().getConfig('tax', 'based_on');
    
    if (this.getQuote().isVirtual()) {
      baseOn = 'billing';
    }
    
    if ((shippingAddress === false && baseOn === 'shipping')
        || (billingAddress === false && baseOn === 'billing')) {
      baseOn = 'default';
    } else {
      if (((billingAddress === false || billingAddress == null || !billingAddress.getCountryId()) && baseOn === 'billing')
          || ((shippingAddress === false || shippingAddress == null || !shippingAddress.getCountryId()) && baseOn === 'shipping')
      ) {
        if (customer) {
          let defBilling  = customer.getDefaultBillingAddress();
          let defShipping = customer.getDefaultShippingAddress();
          if (baseOn === 'billing' && defBilling != null && defBilling.getCountryId()) {
            /*Nếu baseOn billing mà không có truyền billing vào thì lấy default billing của customer*/
            billingAddress = defBilling;
          } else if (baseOn === 'shipping' && defShipping != null && defShipping.getCountryId()) {
            shippingAddress = defShipping;
          } else {
            baseOn = 'default';
          }
        } else {
          baseOn = 'default';
        }
      }
    }
    
    switch (baseOn) {
      case 'billing':
        address = billingAddress;
        break;
      case 'shipping':
        address = shippingAddress;
        break;
      case 'origin':
        address = this.getRateOriginRequest(store);
        break;
      case 'default':
        address.setData('country_id', this.getSetting().getConfig('tax', 'country'));
        address.setData('region', this.getSetting().getConfig('tax', 'region'));
        address.setData('postcode', this.getSetting().getConfig('tax', 'postcode'));
        break;
      default:
        break;
    }
    
    if (customerTaxClass == null && customer) {
      customerTaxClass = customer.getCustomerTaxClassId();
    } else if (customerTaxClass === false || !customer) {
      customerTaxClass = this.getSetting().getConfig('customer', 'not_logged_In_customer_tax_class');
    }
    
    let request = new DataObject();
    request.setData('country_id', address.getData('country_id'));
    request.setData('region_id', address.getData('region_id'));
    request.setData('postcode', address.getData('postcode'));
    request.setData('store', store);
    request.setData('customer_class_id', customerTaxClass);
    
    return request;
  }
  
  getRateOriginRequest(store: any = null): DataObject {
    let request = new DataObject();
    request.setData('country_id', this.getSetting().getConfig('shipping', 'country_id'));
    request.setData('region_id', this.getSetting().getConfig('shipping', 'region_id'));
    request.setData('postcode', this.getSetting().getConfig('shipping', 'postcode'));
    request.setData('customer_class_id', this.getSetting().getConfig('customer', 'default_customer_tax_class'));
    request.setData('store', store);
    return request;
  }
  
  getSetting(): SettingManagement {
    return ObjectManager.getInstance().get<SettingManagement>(SettingManagement.CODE_INSTANCE, SettingManagement);
  }
  
  setCustomer(customer: Customer): Calculation {
    this._customer = customer;
    return this;
  }
  
  getCustomer(): Customer {
    return this._customer;
  }
  
  compareRequests(first: DataObject, second: DataObject) {
    // FIXME: phai compare 2 requset. Co the luc nao cung tra ve false cung dc. se check bang function  _sameRateAsStore
    return false;
  }
  
  getRate(request: DataObject): number {
    if (!request.getData('country_id') || !request.getData('customer_class_id') || !request.getData('product_class_id')) {
      return 0;
    }
    
    let cacheKey = this._getRequestCacheKey(request);
    if (!Calculation._rateCache.hasOwnProperty(cacheKey)) {
      this.unsetData('rate_value');
      this.unsetData('calculation_process');
      this.unsetData('event_module_id');
      EventManager.dispatch('tax_rate_data_fetch', {request, sender: this});
      if (!this.hasData('rate_value')) {
        let rateInfo = this.getResourceCalculation().getRateInfo(request);
        this.setData('calculation_process', rateInfo['process']);
        this.setData('rate_value', rateInfo['value']);
      } else {
        this.setData('calculation_process', this._formCalculationProcess());
      }
      Calculation._rateCache[cacheKey]              = this.getData('rate_value');
      Calculation._rateCalculationProcess[cacheKey] = this.getData('calculation_process');
    }
    return Calculation._rateCache[cacheKey];
  }
  
  getStoreRate(request: DataObject, store: any = null) {
    let storeRequest = this.getRateOriginRequest();
    storeRequest.setData('product_class_id', request.getData('product_class_id'));
    
    return this.getRate(storeRequest);
  }
  
  protected _getRequestCacheKey(request: DataObject): string {
    let key: string = request.getData('store') ? request.getData('store').getData('id') + '|' : '';
    key +=
      request.getData('product_class_id') +
      "|" +
      request.getData('customer_class_id') +
      '|' +
      request.getData('country_id') +
      "|" +
      request.getData('region_id') +
      '|' +
      request.getData('postcode');
    return key;
  }
  
  getResourceCalculation(): ResourceCalculation {
    if (typeof this._resourceCalculation === "undefined") {
      this._resourceCalculation = new ResourceCalculation();
    }
    return this._resourceCalculation;
  }
  
  protected _formCalculationProcess() {
    let title: string = this.getData('rate_title');
    let value         = this.getData('rate_value');
    let id            = this.getData('rate_id');
    
    let rate           = {code: title, title, percent: value, position: 1, priority: 1};
    let process        = {};
    process['percent'] = value;
    process['id']      = `${id}-${value}`;
    process['rates']   = [];
    process['rates'].push(rate);
    
    return [process];
  }
  
  calcTaxAmount(price: number, taxRate: number, priceIncludeTax = false, round = true): number {
    taxRate = parseFloat(taxRate + "") / 100;
    let amount: number;
    if (priceIncludeTax) {
      amount = price * (1 - 1 / (1 + taxRate));
    } else {
      amount = price * taxRate;
    }
    if (round) {
      return this.round(amount);
    }
    
    return amount;
  }
  
  round(price: number): number {
    return StoreManager.getStore().roundPrice(price);
  }
  
  getAppliedRates(request: DataObject) {
    if (!request.getData('country_id') || !request.getData('customer_class_id') || !request.getData('product_class_id')) {
      return [];
    }
    let cacheKey = this._getRequestCacheKey(request);
    if (!Calculation._rateCalculationProcess.hasOwnProperty(cacheKey)) {
      Calculation._rateCalculationProcess[cacheKey] = this.getResourceCalculation().getCalculationProcess(request);
    }
    return Calculation._rateCalculationProcess[cacheKey];
  }
  
  getQuote(): Quote {
    return ObjectManager.getInstance().get<SessionQuote>(SessionQuote.CODE_INSTANCE, SessionQuote).getQuote();
  }
}
