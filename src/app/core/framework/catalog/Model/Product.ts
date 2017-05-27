import {Type} from "./Product/Type";
import {Price} from "./Product/Type/Price";
import {Option} from "./Product/Option";
import * as _ from "lodash";
import {AbstractType} from "./Product/Type/AbstractType";
import {ProductDB} from "../../../../database/xretail/db/product";
import {Option as ConfigurationOption} from "./Product/Configuration/Option";
import {EventManager} from "../../General/Event/EventManager";

export class Product extends ProductDB {
    protected _catalogProductType: Type;
    
    /**
     * Flag for get Price function
     *
     * @var boolean
     */
    protected _calculatePrice: boolean = true;
    protected _typeInstance: AbstractType;
    protected _customOptions: {
        [propName: string]: ConfigurationOption;
    }                                  = {};
    
    /*Override*/
    async getById(id: number | string): Promise<any> {
        let _dataEvent = {product: null, product_id: id};
        EventManager.dispatch("get_product_by_id_from_cache", _dataEvent);
        if (!!_dataEvent['product'] && !!_dataEvent['product'] ['id']) {
            return this.mapWithParent(_dataEvent['product']);
        } else {
            return await super.getById(id);
        }
    }
    
    getPriceModel(): Price {
        /*
         * Lấy product price model dựa vào type của product
         */
        
        return this.getCatalogProductType().priceFactory(this.getData('type_id'));
    }
    
    getPrice(): number {
        if (this._calculatePrice || !this.getData('price')) {
            return this.getPriceModel().getPrice(this);
        } else {
            return parseFloat(this.getData('price') + "");
        }
    }
    
    /*
     * Là giá chưa convert nhưng đã được apply các loại giá khuyến mại
     */
    getFinalPrice(qty = null): number {
        if (this.getData('final_price') === null) {
            this.setData('final_price', parseFloat(this.getPriceModel().getFinalPrice(qty, this) + ""));
        }
        return this.getData('final_price');
    }
    
    setFinalPrice(price: number): Product {
        return <any>this.setData('final_price', price);
    }
    
    getTierPrice(qty = null): any {
        return this.getPriceModel().getTierPrice(qty, this);
    }
    
    getTierPriceRawAsArray(): Array<Object> {
        return this.getData('tier_prices');
    }
    
    getOptionById(optionId: number): Option {
        // chỗ này khác magento bởi vì dữ liệu lấy về đã được tinh chỉnh rồi
        let option = _.find(this.getData('customizable_options'), (option) => option['option_id'] == optionId);
        if (option) {
            let magentoOption = new Option();
            magentoOption     = Object.assign(magentoOption, option);
            return magentoOption;
        }
        return null;
    }
    
    
    getCatalogProductType(): Type {
        if (typeof this._catalogProductType == "undefined")
            this._catalogProductType = new Type();
        return this._catalogProductType;
    }
    
    getTypeInstance(): AbstractType {
        if (typeof this._typeInstance == "undefined") {
            this._typeInstance = this.getCatalogProductType().factory(this);
        }
        return this._typeInstance;
    }
    
    getTypeId(): string {
        return this.getData('type_id');
    }
    
    setCustomerGroupId(customerGroupId: number | string): Product {
        this.setData('customer_group_id', customerGroupId);
        return this;
    }
    
    getPriceType(): number {
        // get bundle type price in new api
        if (this.getTypeId() == 'bundle')
            return this.x_options['bundle']['type_price'];
        
        return this.getData('price_type');
    }
    
    
    setCustomOptions(options: {
                         [propName: string]: ConfigurationOption;
                     }) {
        this._customOptions = options;
    }
    
    getCustomOption(code: string): ConfigurationOption {
        return this._customOptions.hasOwnProperty(code) ? this._customOptions[code] : null;
    }
    
    hasCustomOptions(): boolean {
        return !!_.size(this._customOptions);
    }
    
    
    getCustomOptions(): {
        [propName: string]: ConfigurationOption;
    } {
        return this._customOptions;
    }
    
    getTaxClassId(): number {
        return this.getData('tax_class_id');
    }
    
    isVirtual(): boolean {
        return this.getData('type_id') == 'virtual';
    }
    
    /*
     * add custom option mà user đã chọn(có value) vào product. Mỗi một value là 1 instance của ConfigurationOption
     * */
    addCustomOption(code: string, value: any, product: Product = null): Product {
        if (product == null)
            product = this;
        let option = new ConfigurationOption();
        option.addData({product_id: product.getData('id'), product: product, code: code, value: value});
        this._customOptions[code] = option;
        return this;
    }
}
