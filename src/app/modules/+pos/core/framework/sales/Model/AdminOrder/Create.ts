import {DataObject} from "../../../General/DataObject";
import * as _ from "lodash";
import {Product} from "../../../catalog/Model/Product";
import {GeneralException} from "../../../General/Exception/GeneralException";
import {Initializer} from "./Product/Quote/Initializer";
import {Quote} from "../../../quote/Model/Quote";
import {ObjectManager} from "../../../General/App/ObjectManager";
import {SessionQuote} from "../../../Backend/Model/Session/Quote";
import {Item} from "../../../quote/Model/Quote/Item";

export class Create extends DataObject {
  protected quoteInitializer: Initializer = null;
  protected _quote: Quote                 = null;
  private _needCollect;
  
  addProductToQuote(buyRequest: DataObject) {
    if (buyRequest.getData('qty') == null) {
      buyRequest.setData('qty', 1);
    }
    
    if (!buyRequest.getData('product_id') || !buyRequest.getData('product')) {
      throw new GeneralException("We could not add a product to cart because it have not id or product ");
    }
  
    this.addProduct(buyRequest.getData('product'), buyRequest);
  }
  
  // addProductsAsync(buyRequest: DataObject[]) {
  //   let defer = $q.defer();
  //   let _c    = 0;
  //   if (!_.isArray(buyRequest) || _.size(buyRequest) == 0) {
  //     setTimeout(() => {
  //       return defer.resolve(true);
  //     }, 0);
  //   } else {
  //     _.forEach(buyRequest, (config: DataObject) => {
  //       if (config.getData('qty') == null)
  //         config.setData('qty', 1);
  //
  //       if (!config.getData('product_id'))
  //         throw new GeneralException("We could not add a product to cart because it have not id ");
  //
  //       // improve performance if resolve data product before
  //       if (config.getData('product')) {
  //         setTimeout(() => {
  //           this.addProduct(config.getData('product'), config);
  //           if (++_c == buyRequest.length)
  //             return defer.resolve(true);
  //         }, 0);
  //       } else {
  //         let product = new Product();
  //
  //         product.getById(config['product_id']).then(() => {
  //           this.addProduct(product, config);
  //           if (++_c == buyRequest.length)
  //             return defer.resolve(true);
  //           return defer.resolve(true);
  //         }, e => {
  //           throw new GeneralException("Can't get product to addToQuote");
  //         });
  //       }
  //     });
  //   }
  //
  //   return defer.promise;
  // }
  
  addProduct(product: Product, config: DataObject): Create {
    if (!(config instanceof DataObject)) {
      throw new GeneralException("Buy request must instance of DataObject");
    }
    
    let item = this.getQuoteInitializer().init(this.getQuote(), product, config);
    
    if (_.isString(item))
      throw new GeneralException(<string>item);
    
    // Validate item
    (item as Item).checkData();
    this.setRecollect(true);
    return this;
  }
  
  getQuoteInitializer(): Initializer {
    if (this.quoteInitializer == null) {
      this.quoteInitializer = new Initializer();
    }
    return this.quoteInitializer;
  }
  
  getQuote(): Quote {
    if (this._quote == null) {
      this._quote = this.getSession().getQuote();
    }
    return this._quote;
  }
  
  getSession(): SessionQuote {
    return ObjectManager.getInstance().get<SessionQuote>(SessionQuote.CODE_INSTANCE, SessionQuote);
  }
  
  setRecollect(flag: boolean): Create {
    this._needCollect = flag;
    return this;
  }
}
