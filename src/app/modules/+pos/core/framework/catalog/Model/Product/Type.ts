import {Price} from "./Type/Price";
import {Simple} from "./Type/Simple";
import {GeneralException} from "../../../General/Exception/GeneralException";
import {Product} from "../Product";
import {AbstractType} from "./Type/AbstractType";
import {Configurable} from "../../../configurable-product/Model/Product/Type/Configurable";
import {Price as ConfigurablePrice} from "../../../configurable-product/Model/Product/Type/Configurable/Price";
import {Bundle} from "../../../bundle/Model/Product/Type";
import {Price as BundlePrice} from "../../../bundle/Model/Product/Price";
import {Grouped} from "../../../grouped-product/Model/Product/Type/Grouped";
import {Price as GroupedPrice} from "../../../grouped-product/Model/Product/Type/Grouped/Price";
import {EventManager} from "../../../General/Event/EventManager";
import {DataObject} from "../../../General/DataObject";

export class Type {
  static TYPE_SIMPLE: string         = 'simple';
  static TYPE_CONFIGURABLE: string   = 'configurable';
  static TYPE_BUNDLE: string         = 'bundle';
  static TYPE_GROUPED: string        = 'grouped';
  static TYPE_VIRTUAL: string        = 'virtual';
  static DEFAULT_TYPE_MODEL: string  = 'Simple';
  static DEFAULT_PRICE_MODEL: string = 'Price';
  
  protected _priceModel: Object  = {};
  protected _productType: Object = {};
  
  priceFactory(productType: string) {
    if (!this._priceModel.hasOwnProperty(productType)) {
      switch (productType) {
        case Type.TYPE_VIRTUAL:
        case Type.TYPE_SIMPLE:
          this._priceModel[productType] = new Price();
          break;
        case Type.TYPE_CONFIGURABLE:
          this._priceModel[productType] = new ConfigurablePrice();
          break;
        case Type.TYPE_BUNDLE:
          this._priceModel[productType] = new BundlePrice();
          break;
        case Type.TYPE_GROUPED:
          this._priceModel[productType] = new GroupedPrice();
          break;
        default:
          break;
      }
      
      let eventData = {
        productType, factory: this._priceModel
      };
      EventManager.dispatch('price_factory', eventData);
    }
    
    if (!this._priceModel[productType]) {
      throw new GeneralException("Not yet support this type");
    }
    
    return this._priceModel[productType];
  }
  
  factory(product: Product): AbstractType {
    let productType = product.getTypeId();
    if (!this._productType.hasOwnProperty(productType)) {
      switch (productType) {
        case Type.TYPE_VIRTUAL:
        case Type.TYPE_SIMPLE:
          this._productType[productType] = new Simple();
          break;
        case Type.TYPE_CONFIGURABLE:
          this._productType[productType] = new Configurable();
          break;
        case Type.TYPE_BUNDLE:
          this._productType[productType] = new Bundle();
          break;
        case Type.TYPE_GROUPED:
          this._productType[productType] = new Grouped();
          break;
        default:
          break;
      }
      let eventData = {
        productType, factory: this._productType
      };
      EventManager.dispatch('product_type_factory', eventData);
    }
    
    if (!this._productType[productType]) {
      throw new GeneralException("Not yet support this type");
    }
    
    return this._productType[productType];
  }
}
