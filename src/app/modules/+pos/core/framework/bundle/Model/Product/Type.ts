import {AbstractType} from "../../../catalog/Model/Product/Type/AbstractType";
import {Product} from "../../../catalog/Model/Product";
import {DataObject} from "../../../General/DataObject";
import * as _ from "lodash";
import {GeneralException} from "../../../General/Exception/GeneralException";
import {Price} from "./Price";
import {PriceCurrency} from "../../../directory/Model/PriceCurrency";

export class Bundle extends AbstractType {
    static TYPE_CODE                  = 'bundle';
    static _SELECTIONPRODUCTS: Object = {};
    protected _isComposite            = true;
    protected _canConfigure           = true;
    protected _canUseQtyDecimals      = true;
    protected priceCurrency;
    protected _selectionsCollection;
    
    
    /*
     * Lý dó cần field này.
     * Bởi vì trong quote subtotal có gọi đến function tính price của thằng bundle mà bundle để tính giá nó lại gọi function getSelectionsByIds
     * Function trên khi gọi chị lấy ra các selection dạng Object[] javascript chứ không phải là Product[]
     * Vì thế sẽ chặn function trên nếu đã resole data selection thì sẽ trả về luôn
     */
    static _SELECTIONS: Object = {};
    
    protected _prepareProduct(buyRequest: DataObject, product: Product, processMode: string): Product[] {
        let result              = super._prepareProduct(buyRequest, product, processMode);
        let isStrictProcessMode = this._isStrictProcessMode(processMode);
        
        let skipSaleableCheck = this.getCatalogProductHelper().getSkipSaleableCheck();
        
        let options = buyRequest.getData('bundle_option');
        
        let selections: Product[];
        let optionIds;
        if (_.isObject(options)) {
            optionIds = _.keys(options);
            
            if (_.isEmpty(optionIds) && isStrictProcessMode)
                throw new GeneralException("Please specify product option(s).");
            
            // Check options require sẽ làm ở view.
            
            selections = this._getSelection(buyRequest, product);
            if (selections == null)
                selections = [];
        } else {
            throw new GeneralException("Bundle must have bundle_option");
        }
        if (_.size(selections) > 0 || !isStrictProcessMode) {
            let uniqueKey: any = [product.getData('id')];
            let selectionIds   = [];
            let qtys           = buyRequest.getData('bundle_option_qty');
            
            _.forEach(selections, (selection: Product) => {
                let selectionOptionId = selection.getData('option_id');
                let qty               = this.getQty(selection, qtys, selectionOptionId);
                
                let selectionId = selection.getData('selection_id');
                product.addCustomOption('selection_qty_' + selectionId, qty, selection);
                selection.addCustomOption('selection_id', selectionId);
                
                let beforeQty = this.getBeforeQty(product, selection);
                product.addCustomOption('product_qty_' + selection.getData('id'), qty + beforeQty, selection);
                
                /*
                 * Create extra attributes that will be converted to product options in order item
                 * for selection (not for all bundle)
                 */
                let priceModel = <Price>product.getPriceModel();
                let price      = priceModel.getSelectionFinalTotalPrice(product, selection, 0, qty);
                let attributes = {
                    price: this.getPriceCurrency().convert(price),
                    qty: qty,
                    option_label: selection.getData('option')['title'],
                    option_id: selection.getData('option_id')
                };
                let _result    = selection.getTypeInstance().prepareForCartAdvanced(buyRequest, selection);
                this.checkIsResult(_result);
                result.push(_result[0].setData('parent_product_id', product.getData('id'))
                                      .addCustomOption('bundle_option_ids', optionIds)
                                      .addCustomOption('bundle_selection_attributes', attributes));
                
                if (isStrictProcessMode) {
                    _result[0].setData('cart_qty', qty);
                }
                
                let resultSelectionId = _result[0].getData('selection_id');
                selectionIds.push(resultSelectionId);
                uniqueKey.push(resultSelectionId);
                uniqueKey.push(qty);
            });
            
            uniqueKey = uniqueKey.join("_");
            _.forEach(result, (item: Product) => {
                item.addCustomOption('bundle_identity', uniqueKey);
            });
            
            product.addCustomOption('bundle_option_ids', optionIds)
                   .addCustomOption('bundle_selection_ids', selectionIds);
            
            return result;
        }
        
        return [];
    }
    
    private multiToFlatArray(options: Object): Object {
        let flatArray = {};
        _.forEach(options, (value, key) => {
            if (_.isObject(value)) {
                flatArray = _.merge(flatArray, this.multiToFlatArray(value));
            } else {
                flatArray[key] = value;
            }
        });
        
        return flatArray;
    }
    
    protected getQty(selection: Product, qtys: Object, selectionOptionId: string) {
        let qty: number;
        if (selection.getData('selection_can_change_qty')
            && (qtys.hasOwnProperty(selectionOptionId) || qtys.hasOwnProperty(parseInt(selectionOptionId)))
            && (!isNaN(parseFloat(qtys[selectionOptionId])) || !isNaN(parseFloat(qtys[selectionOptionId])))) {
            const _qty = qtys.hasOwnProperty(selectionOptionId) ? parseFloat(qtys[selectionOptionId]) : parseFloat(qtys[selectionOptionId + ""]);
            qty        = _qty ? _qty : 1;
        } else {
            qty = parseFloat(selection.getData('selection_qty')) ? parseFloat(selection.getData('selection_qty')) : 1;
        }
        return qty;
    }
    
    protected getBeforeQty(product: Product, selection: Product) {
        let beforeQty    = 0;
        let customOption = product.getCustomOption('product_qty_' + selection.getData('id'));
        if (customOption && customOption.getData('product').getData('id') == selection.getData('id')) {
            beforeQty = parseFloat(customOption.getValue());
        }
        
        return beforeQty;
    }
    
    getSelectionsByIds(selectionIds: any[], product: Product): Object[] {
        let _cacheKey = this.getCacheKeySelection(product, selectionIds);
        if (Bundle._SELECTIONS.hasOwnProperty(_cacheKey))
            return Bundle._SELECTIONS[_cacheKey];
        
        let selections = this.getSelectionsCollection(product);
        return _.filter(selections, (selection: Object) => {
            return _.indexOf(selectionIds, parseInt(selection['selection_id'])) > -1 || _.indexOf(selectionIds, selection['selection_id']) > -1;
        });
    }
    
    getOptionById(optionId: number | string, product: Product): Object {
        return _.find(this.getOptionsCollection(product), (o) => o['option_id'] == optionId);
    }
    
    getOptionsCollection(product): Object[] {
        if (product.getTypeId() != "bundle")
            throw new GeneralException("Can't get selection if product isn't bundle");
        return product.x_options['bundle']['options'];
    }
    
    getSelectionsCollection(product: Product): Object[] {
        if (typeof this._selectionsCollection == "undefined") {
            let options    = this.getOptionsCollection(product);
            let selections = [];
            _.forEach(options, (option) => {
                //noinspection TypeScriptUnresolvedFunction
                selections = _.concat(selections, option['selections']);
            });
            this._selectionsCollection = selections;
        }
        return this._selectionsCollection;
    }
    
    protected getPriceCurrency(): PriceCurrency {
        if (typeof this.priceCurrency == "undefined")
            this.priceCurrency = new PriceCurrency();
        return this.priceCurrency;
    }
    
    protected checkIsResult(result: any) {
        if (!_.isArray(result))
            throw  new GeneralException("Error when resolve each child bundle product");
    }
    
    resolveBundle(buyRequest: DataObject, product: Product) {
        return this.resolveSelectionsAndMergeWithOption(buyRequest.getData('bundle_option'), product);
    }
    
    private _getSelection(buyRequest: DataObject, product: Product) {
        let key = this.getCacheKeyOptions(buyRequest.getData('bundle_option'), product);
        if (!Bundle._SELECTIONPRODUCTS.hasOwnProperty(key)) {
            throw new GeneralException("Must resolve bundle before");
        } else
            return Bundle._SELECTIONPRODUCTS[key];
    }
    
    protected resolveSelectionsAndMergeWithOption(options: Object, product: Product) {
        if (product.getTypeId() != 'bundle')
            throw new GeneralException("Can't resolve because of this product not a bundle");
        
        let key = this.getCacheKeyOptions(options, product);
        if (!Bundle._SELECTIONPRODUCTS.hasOwnProperty(key)) {
            let selections: any[] = [];
            
            
            _.forEach(options, (optionValue, optionId) => {
                let option = this.getOptionById(optionId, product);
                
                // retrieve all selections of options
                let _selections;
                if (_.isArray(optionValue))
                    _selections = this.getSelectionsByIds(optionValue, product);
                else
                    _selections = this.getSelectionsByIds([optionValue], product);
                
                // merge it with product data
                _.forEach(_selections, async (s: Object) => {
                    s['option']       = option;
                    s['option_label'] = option['title'];
                    selections.push(s);
                });
            });
            
            let result   = [];
            _.forEach(selections, (_s: Object) => {
                let _p = new Product();
                _p.addData(_s);
                result.push(_p);
            });
          let _cacheKey                 = this.getCacheKeySelection(product, selections);
          Bundle._SELECTIONS[_cacheKey] = Bundle._SELECTIONPRODUCTS[key] = result;
        }
  
      return Bundle._SELECTIONPRODUCTS[key];
    }
    
    private getCacheKeyOptions(options: Object, product: Product): string {
        let key: string = "s-" + product.getData('id');
        _.forEach(options, (v, k) => {
            key += "_" + k;
            if (_.isArray(v)) {
                _.forEach(v, (value) => {
                    key += "-" + value;
                });
            } else {
                key += "-" + v;
            }
        });
        return key;
    }
    
    private getCacheKeySelection(product: Product, selections: any[]): string {
        let key = "s-" + product.getData('id');
        
        // must sort before generate cache key when selection can change order
        selections = _.sortBy(selections, (s) => {
            if (s.hasOwnProperty('selection_id'))
                return s['selection_id'];
            else
                return s;
        });
        _.forEach(selections, (s) => {
            if (s.hasOwnProperty('selection_id'))
                key += s['selection_id'];
            else
                key += s;
        });
        return key;
    }
}
