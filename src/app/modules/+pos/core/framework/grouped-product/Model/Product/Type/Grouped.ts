import {AbstractType} from "../../../../catalog/Model/Product/Type/AbstractType";
import {DataObject} from "../../../../General/DataObject";
import {Product} from "../../../../catalog/Model/Product";
import {GeneralException} from "../../../../General/Exception/GeneralException";
import * as _ from "lodash";

export class Grouped extends AbstractType {
  static TYPE_CODE        = "grouped";
  protected _isComposite  = true;
  protected _canConfigure = true;

  static _ASSOCIATEDPRODUCTS: Object = {};

  getProductInfo(buyRequest: DataObject, product: Product, isStrictProcessMode: boolean) {
    let productsInfo       = buyRequest.getData('super_group') ? buyRequest.getData('super_group') : [];
    let associatedProducts = this.getAssociatedProducts(product);

    if (!_.isObject(productsInfo)) {
      throw new GeneralException("Please specify the quantity of product(s).");
    }
    _.forEach(associatedProducts, (subProduct: Product) => {
      if (!productsInfo.hasOwnProperty(parseInt(subProduct.getData('id')))
          && !productsInfo.hasOwnProperty(subProduct.getData('id') + "")) {
        if (isStrictProcessMode && !subProduct.getData('qty')) {
          throw new GeneralException("Please specify the quantity of product(s).");
        }
        productsInfo[subProduct.getData('id')] = parseInt(subProduct.getData('qty'));
      }
    });

    return productsInfo;
  }

  protected _prepareProduct(buyRequest: DataObject, product: Product, processMode: string): Product[] {
    let products               = [];
    let associatedProductsInfo = [];
    let isStrictProcessMode    = this._isStrictProcessMode(processMode);
    let productInfo            = this.getProductInfo(buyRequest, product, isStrictProcessMode);

    let associatedProducts = !isStrictProcessMode || !_.isEmpty(productInfo) ? this.getAssociatedProducts(product) : false;

    _.forEach(associatedProducts, (subProduct: Product) => {
      let qty = productInfo.hasOwnProperty(subProduct.getData('id') + "") ?
        productInfo[subProduct.getData('id') + ""] :
        productInfo[parseInt(subProduct.getData('id'))];
      if (isNaN(qty) || qty === "" || qty === null) {
        return true;
      }

      let _result = <Product[]> subProduct.getTypeInstance().prepareForCartAdvanced(buyRequest, subProduct, processMode);

      if (!_.isArray(_result)) {
        throw new GeneralException("Can't process the item");
      }

      if (isStrictProcessMode) {
        _result[0].setData('cart_qty', qty)
                  .addCustomOption('product_type', Grouped.TYPE_CODE, product)
                  .addCustomOption('info_buyRequest', {
                    super_product_config: {
                      product_type: Grouped.TYPE_CODE,
                      product_id: product.getData('id')
                    }
                  });

        products.push(_result[0]);
      } else {
        let _info                       = {};
        _info[subProduct.getData('id')] = qty;
        associatedProductsInfo.push(_info);
      }
    });

    if (!isStrictProcessMode || _.size(associatedProductsInfo)) {
      product.addCustomOption('product_type', Grouped.TYPE_CODE, product)
             .addCustomOption('info_buyRequest', buyRequest);
    }

    if (_.size(products)) {
      return products;
    }

    throw new GeneralException("Please specify the quantity of product(s).");
  }

  getAssociatedProducts(product: Product): Product[] {
    if (!Grouped._ASSOCIATEDPRODUCTS.hasOwnProperty(product.getData('id'))) {
      throw new GeneralException("Can't get associated product. Please resolve before");
    }

    return Grouped._ASSOCIATEDPRODUCTS[product.getData('id')];
  }

  /*
   * Phải gọi ở view trước để tạo data cho associated product
   */
  async resolveAssociatedProducts(product: Product) {
    return new Promise((resolve, reject) => {
      if (Grouped._ASSOCIATEDPRODUCTS.hasOwnProperty(product.getData('id'))) {
        return true;
      }
  
      if (product.getTypeId() !== Grouped.TYPE_CODE) {
        throw new GeneralException("Can't get associated product becase this isn't a grouped product");
      }
  
      let groupeds: Object[] = product.x_options['grouped'];
  
      /*
       * Không thể dùng lodash với async nên phải dùng bộ đếm để biết lúc nào end
       */
      let _process = 1;
      let result   = [];
      _.forEach(groupeds, async (group) => {
        let _p  = new Product();
        let _id = group.hasOwnProperty('id') ? group['id'] : group['entity_id'];
        await _p.getById(_id);
        _p.addData(group);
        result.push(_p);
        if (++_process === groupeds.length) {
          Grouped._ASSOCIATEDPRODUCTS[product.getData('id')] = result;
          return resolve(result);
        }
      });
    });
  }

}
