import {Injectable} from '@angular/core';
import {Product} from "../../../../../core/framework/catalog/Model/Product";
import * as _ from 'lodash';

@Injectable()
export class ProductOptionsService {
  
  constructor() { }
  
  /*
   * Các attribute của configurable phải được chọn theo thứ tự
   */
  isDisableAttribute(product: Product, attribute: Object, super_attribute: Object) {
    let keys     = _.keys(product.x_options['configurable']['attributes']);
    let keyIndex = _.indexOf(keys, attribute['id']);
    if (keyIndex > 0) {
      return !(super_attribute.hasOwnProperty(keys[keyIndex - 1]) && !!super_attribute[keys[keyIndex - 1]]);
    } else {
      return false;
    }
  }
  
  /*
   * Khi user chon attribute roi thi cac attribute khac co the bi disable mot vai option
   */
  isDisableOption(product: Product, currentOption: Object, superAttributeSelected: Object): boolean {
    let productArray          = [];
    let attributeSelectedKeys = _.keys(superAttributeSelected);
    _.forEach(superAttributeSelected, (optionId, attributeId) => {
      if (!optionId && !attributeId) {
        return true;
      }
      
      // Nếu currentOption thuộc attribute chưa được chọn thì cứ lấy toàn bộ các attribute đã được chọn để so sánh
      // Nếu currentOption thuộc attribute đã được chọn thì chỉ lấy các option thuộc những attribute đã được chọn trước đó
      if (superAttributeSelected.hasOwnProperty(currentOption['attribute_id']) && _.indexOf(attributeSelectedKeys, currentOption['attribute_id']) <= _.indexOf(attributeSelectedKeys, attributeId)) {
        return true;
      }
      
      // Nếu là các option của cái option đã select rồi thì bỏ qua
      if (parseInt(attributeId + '') === parseInt(currentOption['attribute_id'] + '')) {
        return true;
      }
      
      // get option data of each option, which has been selected before
      let _option = _.find(product.x_options['configurable']['attributes'][attributeId]['options'], (op) => parseInt(op['id'] + '') == parseInt(optionId + ''));
      if (_option) {
        productArray.push(_option['products']);
      } else {
        return true;
      }
    });
    
    if (_.isEmpty(productArray)) {
      return false;
    }
    
    productArray.push(currentOption['products']);
    
    return _.size(_.intersection(...productArray)) === 0;
  }
}
