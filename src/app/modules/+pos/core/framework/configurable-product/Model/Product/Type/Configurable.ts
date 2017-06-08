import {AbstractType} from "../../../../catalog/Model/Product/Type/AbstractType";
import {DataObject} from "../../../../General/DataObject";
import {Product} from "../../../../catalog/Model/Product";
import {GeneralException} from "../../../../General/Exception/GeneralException";
import * as _ from "lodash";
import {Option as ConfigurationOption} from "../../../../catalog/Model/Product/Configuration/Option";

export class Configurable extends AbstractType {
    static TYPE_CODE              = "configurable";
    static _CHILDPRODUCTS: Object = {};
    protected _isComposite        = true;
    protected _canConfigure       = true;
    protected _canUseQtyDecimals  = true;
    
    protected _prepareProduct(buyRequest: DataObject, product: Product, processMode: string): Product[] {
        let attributes = buyRequest.getData('super_attribute');
        
        let result = super._prepareProduct(buyRequest, product, processMode);
        if (_.isArray(result)) {
            // sub product must resolve when user add to cart
            let subProduct: Product = this._getChildProduct(buyRequest.getData('super_attribute'), product);
            if (subProduct) {
                let subProductLinkFieldId = subProduct.getData('id');
                
                // validate subProduct existed
                if (subProductLinkFieldId == null)
                    throw new GeneralException("This child of configurable product does not belong to website");
                
                // product options use in order list
                result[0].setData('product_options_attributes_info', subProduct.getData('product_options_attributes_info'));
                
                // Dùng trong func get Final price cua configurable type
                product.addCustomOption('attributes', attributes)
                       .addCustomOption('product_qty_' + subProductLinkFieldId, 1, subProduct)
                       .addCustomOption('simple_product', subProductLinkFieldId, subProduct);
                
                let _result = subProduct.getTypeInstance().processConfiguration(buyRequest, subProduct, processMode);
                if (!_.isArray(_result))
                    throw new GeneralException("You can't add the item to shopping cart.");
                
                /**
                 * Adding parent product custom options to child product
                 * to be sure that it will be unique as its parent
                 */
                let optionIds: ConfigurationOption = product.getCustomOption('option_ids');
                if (optionIds) {
                    optionIds = optionIds.getValue().split(",");
                    _.forEach(optionIds, (optionId: string) => {
                        let option: any = product.getCustomOption('option_' + optionId);
                        if (option) {
                            _result[0].addCustomOption('option_' + optionId, option.getValue());
                        }
                    });
                }
                
                // set parent product id for stick. Use in quote addProduct
                let productLinkFieldId = product.getData('id');
                _result[0].setData('parent_product_id', productLinkFieldId)
                          .addCustomOption('parent_product_id', productLinkFieldId);
                
                if (this._isStrictProcessMode(processMode)) {
                    _result[0].setData('cart_qty', 1);
                }
                
                result.push(_result[0]);
                return result;
            } else {
                if (this._isStrictProcessMode(processMode))
                    throw new GeneralException("Child product must resolve when user add to cart");
                else
                    return result;
            }
        }
        
        throw new GeneralException("Can't resolve configurable product");
    }
    
    private _getChildProduct(attributesInfo: Object, product: Product): Product {
        let _cacheKey = this.getChildProductCacheKey(attributesInfo, product);
        if (!Configurable._CHILDPRODUCTS.hasOwnProperty(_cacheKey)) {
            throw new GeneralException("Must resolve child product before");
        } else {
            return Configurable._CHILDPRODUCTS[_cacheKey];
        }
    }
    
    async resolveConfigurable(buyRequest: DataObject, product: Product) {
        return this.getProductByAttributes(buyRequest.getData('super_attribute'), product);
    }
    
    /*
     * Override lại magento bởi vì đã có giá trị trả về từ connector.
     */
    private async getProductByAttributes(attributesInfo: Object, product: Product) {
      return new Promise((resolve, reject)=>{
        let _cacheKey = this.getChildProductCacheKey(attributesInfo, product);
        if (!Configurable._CHILDPRODUCTS.hasOwnProperty(_cacheKey)) {
          if (!product.hasOwnProperty('x_options')
              || !product.x_options.hasOwnProperty('configurable')
              || !product.x_options['configurable'].hasOwnProperty('attributes'))
            throw new GeneralException("Can't find configurable data of this product");
    
          let attributes     = product.x_options['configurable']['attributes'];
          let productIdArray = [];
    
          // product options will use in order list
          let _productOptionsAttr = [];
          _.forEach(attributesInfo, (attributeValue, attributeId) => {
            if (!attributes.hasOwnProperty(attributeId))
              throw new GeneralException("Not found attribute id =  " + attributeId + " in product configurable");
      
            let selectOption = _.find(attributes[attributeId]['options'], o => o['id'] == attributeValue);
      
            if (!selectOption)
              throw new GeneralException("Not found selected option attribute id =  " +
                                         attributeId +
                                         " with option value id = " +
                                         attributeValue +
                                         " in product" +
                                         " configurable");
      
            productIdArray.push(selectOption['products']);
            _productOptionsAttr.push({value: selectOption['label'], label: attributes[attributeId]['label']});
          });
    
          let childProductId: any = _.intersection(...productIdArray);
          if (_.isArray(childProductId)) {
            childProductId   = childProductId[0];
            let childProduct = new Product();
            childProduct.getById(childProductId)
                        .then(() => {
                          childProduct.setData('product_options_attributes_info', _productOptionsAttr);
                          Configurable._CHILDPRODUCTS[_cacheKey] = childProduct;
                          return resolve(childProduct);
                        });
          } else {
            throw new GeneralException("Can't resolve child product id");
          }
        } else {
          setTimeout(() => {
            return resolve(Configurable._CHILDPRODUCTS[_cacheKey]);
          }, 0);
        }
      });
    }
    
    getChildProductCacheKey(attributesInfo: Object, product: Product): string {
        let key: string = "c-" + product.getData('id');
        _.forEach(attributesInfo, (v, k) => {
            key += "_" + v + "-" + k;
        });
        return key;
    }
}
