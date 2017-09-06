import {DataObject} from "../../../../General/DataObject";
import {Product} from "../../Product";
import * as _ from "lodash";
import * as moment from "moment";
import {ProductHelper} from "../../../Helper/Product";
import {GeneralException} from "../../../../General/Exception/GeneralException";
export abstract class AbstractType {
    /**
     * Process modes
     *
     * Full validation - all required options must be set, whole configuration
     * must be valid
     */
    static PROCESS_MODE_FULL = 'full';
    static PROCESS_MODE_LITE = 'lite';

    static CALCULATE_CHILD  = 0;
    static CALCULATE_PARENT = 1;

    static OPTION_PREFIX = "option_";
    protected _catalogProduct: ProductHelper;

    processConfiguration(buyRequest: DataObject, product: Product, processMode: string = AbstractType.PROCESS_MODE_LITE) {
        return this._prepareProduct(buyRequest, product, processMode);
    }

    prepareForCartAdvanced(buyRequest: DataObject, product: Product, processMode: string = null): any[] {
        if (processMode == null)
            processMode = AbstractType.PROCESS_MODE_FULL;

        return this._prepareProduct(buyRequest, product, processMode);
    }

    protected _prepareProduct(buyRequest: DataObject, product: Product, processMode: string): Product[] {
        let options;
        try {
            options = this._prepareOptions(buyRequest, product, processMode);
        } catch (e) {
            //FIXME: configurable with customizable option
            // return e.getMessage();
        }

        // FIXME: implement try to found super product configuration


        // Add custom option (nếu có) vào product. Chỗ này chính là nơi add data dùng để tính giá custom options
        if (options) {
            //noinspection TypeScriptUnresolvedFunction
            let optionsIds = _.keysIn(options);
            product.addCustomOption('option_ids', optionsIds.join(","));
            _.forEach(options, (optionValue: any, optionId: string) => {
                product.addCustomOption(AbstractType.OPTION_PREFIX + optionId, optionValue);
            });
        }

        if (this._isStrictProcessMode(processMode))
            product.setData('cart_qty', buyRequest.getData('qty'));

        product.setData('qty', buyRequest.getData('qty'));

        return [product]
    }

    /*
     * Ở magento sẽ là validate option(require, value) dựa vào những options của product và buyRequest.
     * Nếu là mode lite thì có thể bỏ qua không có lỗi. Mode này dùng cho sản phẩm có cha là configurable thì sẽ không có customize options cho
     * sản phẩm con
     * Để simple thì sẽ làm việc validate ở view và trong này chỉ lấy giá trị ra thôi.
     */
    protected _prepareOptions(buyRequest: DataObject, product: Product, processMode: string): Object {
        /*
         * Array
         (
         [62] => xyz
         [63] => 52
         )
         * Trong đó:
         *  - option 62 là dạng field. Với những option không có value là 1 kiểu riêng mà do người dùng nhập thì giá trị chính bằng giá trị
         * người dùng nhập.
         *  - optión 63 là dạng select thì giá trị của nó chính bằng giá trị của option_value. trong table: catalog_product_option_type_value
         * */
        let keysRemove = [];
        if (buyRequest.getData('options')) {
            let productOptionCustomOption = [];
            _.forEach(buyRequest.getData('options'), (value: any, key: any) => {

                if (typeof value === "undefined" || value === false || value === "" || value === null)
                    delete buyRequest.getData('options')[key];
                else {
                    let _option = _.find(product.getData('customizable_options'), (option) => option['option_id'] == key);
                    if (_option) {
                        let _productOption = {
                            value: "",
                            label: _option['title'],
                            option_id: _option['option_id'],
                            option_type: _option['type'],
                        };
                        if (_.indexOf(["multiple", "checkbox", "radio", "drop_down"], _option['type']) > -1) {
                            if (_.isArray(value)) {
                                let _first = true;
                                _.forEach(value, (v) => {
                                    let _selection = _.find(_option['data'], (s) => s['option_type_id'] == v);
                                    if (_selection) {
                                        _productOption['value'] += _first ? _selection['title'] : (", " + _selection['title']);
                                        _first = false;
                                    }
                                });

                                // set option to buyRequest
                                _productOption['option_value'] = buyRequest.getData('options')[key] = value.join(",");

                            } else {
                                let _selection = _.find(_option['data'], (s) => s['option_type_id'] == value);
                                if (_selection) {
                                    _productOption['value'] += _selection['title'];
                                }
                            }
                        } else if(_option['type'] == "date") {
                            _productOption['value'] += moment(value['data_date']).format("ll");
                        }else if (_option['type'] == "date_time") {
                            _productOption['value'] += moment(value['data_time']).format("l LT");
                        }else if (_option['type'] == "time"){
                            _productOption['value'] += moment(value['date_time']).format("LT");
                        }else{
                            _productOption['value'] = value;
                        }

                        productOptionCustomOption.push(_productOption);
                        // phai cho set buy request ra ngoai foreach de lay het duoc tat ca custom option vao trong receipt
                        // buyRequest.setData('product_options_custom_option', productOptionCustomOption);
                    } else {
                        throw new GeneralException("Sorry. Can't find custom option");
                    }
                }
            });
            buyRequest.setData('product_options_custom_option', productOptionCustomOption);
        }
        return buyRequest.getData('options');
    }

    protected _isStrictProcessMode(processMode: string): boolean {
        return processMode == AbstractType.PROCESS_MODE_FULL;
    }

    getCatalogProductHelper(): ProductHelper {
        if (typeof this._catalogProduct == "undefined")
            this._catalogProduct = new ProductHelper();
        return this._catalogProduct;
    }
}
