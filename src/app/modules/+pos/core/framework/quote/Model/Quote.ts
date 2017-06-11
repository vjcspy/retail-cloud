import {DataObject} from "../../General/DataObject";
import {Product} from "../../catalog/Model/Product";
import {AbstractType} from "../../catalog/Model/Product/Type/AbstractType";
import {Item} from "./Quote/Item";
import {GeneralException} from "../../General/Exception/GeneralException";
import * as _ from "lodash";
import {EventManager} from "../../General/Event/EventManager";
import {Processor} from "./Quote/Item/Processor";
import {TotalCollector} from "./TotalCollector";
import {Address} from "./Quote/Address";
import {Store} from "../../store/Model/Store";
import {StoreManager} from "../../store/Model/StoreManager";
import {Session} from "../../customer/Model/Session";
import {ObjectManager} from "../../General/App/ObjectManager";
import {Customer} from "../../customer/Model/Customer";
import {SettingManagement} from "../../setting/SettingManagement";
export class Quote extends DataObject {
    protected _items: Item[]                  = [];
    protected itemProcessor: Processor        = null;
    protected _addresses: Address[]           = [];
    protected totalsCollector: TotalCollector = null;
    protected _isMultiShipping: boolean       = false;
    protected _retailAdditionData             = {};

    /*
     * Từ product và request data để đưa ra item push vào quote
     * */
    addProduct(product: Product, request: any = null, processMode: string = AbstractType.PROCESS_MODE_FULL): Item|string {
        if (request == null) {
            request = 1;
        }
        if (_.isNumber(request)) {
            let _o  = new DataObject();
            request = _o.addData({qty: request});
        }
        if (!(request instanceof DataObject)) {
            throw new GeneralException("We found an invalid request for adding product to quote.");
        }

        let cartCandidates = product.getTypeInstance()
                                    .prepareForCartAdvanced(request, product, processMode);

        if (_.isString(cartCandidates)) {
            throw new GeneralException("Error when prepare cart advance");
        }

        let parentItem = null;
        let errors     = [];
        let item       = null;
        let items      = [];
        _.forEach(
            cartCandidates, (candidate) => {
                let stickWithinParent = candidate.getData('parent_product_id') ? parentItem : null;
                candidate.setData('parent_product_id', stickWithinParent);

                item = this.getItemByProduct(candidate);
                if (item === false) {
                    item = this.getItemProcessor().init(candidate, request);
                    (item as Item).setData('quote', this);
                    // Add only item that is not in quote already
                    this.addItem(item);
                }
                items.push(item);

                /**
                 * As parent item we should always use the item of first added product
                 */
                if (!parentItem) {
                    parentItem = item;
                }
                if (parentItem && candidate.getData("parent_product_id")) {
                    (item as Item).setParentItem(parentItem);
                }

                this.getItemProcessor().prepare((item as Item), request, candidate);

                // set data buy_request for checking in quote. Magento haven't this.
                (item as Item).setData('buy_request', request);

                // TODO: add product options for order list. It will deference magento
                this.addProductOptions(item as Item, {});

                if ((item as Item).getData('has_error')) {
                    throw new GeneralException((item as Item).getData('messages'));
                }
            });

        EventManager.dispatch('sales_quote_product_add_after', {items: items});

        return parentItem;
    }

    /*
     * Magento haven't function.
     * Will save data product option to show in order list
     */
    private addProductOptions(item: Item, data: any): Quote {
        let _data        = {};
        let customOption = item.getData('buy_request').getData('product_options_custom_option');

        if (customOption != null) {
            _data['options'] = customOption;
        }

        if (item.getData('product').getTypeId() == 'configurable') {
            _data['attributes_info'] = item.getData('product').getData("product_options_attributes_info");
        }

        if (item.getParentItem() && item.getParentItem().getData('product').getTypeId() == 'bundle') {
            _data = {
                option_label: item.getProduct().getData('option_label'),
                option_id: item.getProduct().getData('option_id')
            };
        }
        item.setData('product_options', _data);

        return this;
    }

    getItemByProduct(product: Product): Item|boolean {
        _.forEach(
            this.getAllItems(), (item: Item) => {
                if (item.representProduct(product))
                    return item;
            });
        return false;
    }

    getAllItems(): Item[] {
        let items = [];
        _.forEach(
            this._items, (item: Item) => {
                if (item.getData('is_deleted') != true) {
                    items.push(item);
                }
            });
        return items;
    }

    getAllVisibleItems(): Item[] {
        let items = [];
        _.forEach(this._items, (item: Item) => {
            if (item.getData('is_deleted') != true && !item.getParentItem()) {
                items.push(item);
            }
        });
        return items;
    }

    addItem(item: Item) {
        item.setData('quote', this);

        EventManager.dispatch('sales_quote_add_item', {quote_item: item});

        this._items.push(item);
    }

    getItemProcessor(): Processor {
        if (this.itemProcessor === null) {
            this.itemProcessor = new Processor();
        }
        return this.itemProcessor;
    }

    collectTotals(): Quote {
        if (this.getData('totals_collected_flag') === true) {
            return this;
        }
        EventManager.dispatch("sales_quote_collect_totals_before", {quote: this});
        this.setData('subtotal', 0);
        this.setData('base_subtotal', 0);

        this.setData('subtotal_with_discount', 0);
        this.setData('base_subtotal_with_discount', 0);

        this.setData('grand_total', 0);
        this.setData('base_grand_total', 0);

        _.forEach(
            this.getAllAddresses(), (address: Address) => {
                //FIXME: remove after. Now, we only collect total in shipping address
                if (address.getData('address_type') == Address.TYPE_BILLING)
                    return true;

                address.setData('subtotal', 0);
                address.setData('base_subtotal', 0);

                address.setData('grand_total', 0);
                address.setData('base_grand_total', 0);

                address.collectTotals();

                this.setSubtotal(this.getSubtotal() + address.getSubtotal());
                this.setBaseSubtotal(this.getBaseSubtotal() + address.getBaseSubtotal());

                this.setSubtotalWithDiscount(this.getSubtotalWithDiscount() + address.getSubtotalWithDiscount());
                this.setBaseSubtotalWithDiscount(this.getBaseSubtotalWithDiscount() + address.getBaseSubtotalWithDiscount());

                this.setGrandTotal(this.getGrandTotal() + address.getGrandTotal());
                this.setBaseGrandTotal(this.getBaseGrandTotal() + address.getBaseGrandTotal());
            });

        this.setData('items_count', 0);
        this.setData('items_qty', 0);
        this.setData('virtual_items_qty', 0);

        _.forEach(this.getAllItems, (item: Item) => {
            if (item.getParentItem()) {
                return true;
            }

            let children = item.getChildren();
            if (item.getProduct().getData('is_virtual')) {
                this.setData('virtual_items_qty', this.getData('virtual_items_qty') + item.getQty());
            }
            this.setData('items_count', this.getData('items_count') + 1);
            this.setData('items_qty', this.getData('items_qty') + item.getQty());
        });
        this.setData('trigger_recollect', 0);

        // this.validateCouponCode();

        EventManager.dispatch("sales_quote_collect_totals_after", {quote: this});
        this.setData('totals_collected_flag', true);
        return this;
    }

    getTotalsCollector(): TotalCollector {
        if (this.totalsCollector === null) {
            this.totalsCollector = new TotalCollector();
        }
        return this.totalsCollector;
    }

    getAllAddresses(): Address[] {
        let addresses = [];
        _.forEach(
            this._addresses, (address: Address) => {
                if (!address.getData('is_deleted')) {
                    addresses.push(address);
                }
            });
        return addresses;
    }

    setShippingAddress(address: Address = null): Quote {
        if (this.isMultiShipping() === true) {
            this.addAddress(<Address>address.setData('address_type', Address.TYPE_SHIPPING));
        } else {
            let old = this.getShippingAddress();
            Object.assign(old, address);
        }
        return this;
    }

    setBillingAddress(address: Address = null): Quote {
        let old = this.getBillingAddress();
        Object.assign(old, address);
        return this;
    }

    getShippingAddress(): Address {
        return this._getAddressByType(Address.TYPE_SHIPPING);
    }

    getBillingAddress(): Address {
        return this._getAddressByType(Address.TYPE_BILLING);
    }

    protected _getAddressByType(type: string): Address {
        let _address = null;
        _.forEach(
            this._addresses, (address: Address) => {
                if (address.getData('address_type') == type && !address.getData('is_deleted')) {
                    _address = address;
                    return false;
                }
            });
        if (_address !== null) {
            return _address;
        }

        _address = new Address();
        _address.setData('address_type', type);
        this.addAddress(_address);

        return _address;
    }

    isMultiShipping(): boolean {
        return this._isMultiShipping;
    }

    addAddress(address: Address) {
        address.setData('quote', this);
        this._addresses.push(address);
    }

    getStore(): Store {
        return StoreManager.getStore();
    }

    getSubtotal(): number {
        return this.getData('subtotal');
    }

    setSubtotal(total: number): Quote {
        return <any>this.setData('subtotal', total);
    }

    getBaseSubtotal(): number {
        return this.getData('base_subtotal');
    }

    setBaseSubtotal(total: number): Quote {
        return <any>this.setData('base_subtotal', total);
    }

    getGrandTotal(): number {
        return this.getData('grand_total');
    }

    setGrandTotal(total: number): Quote {
        return <any>this.setData('grand_total', total);
    }

    getBaseGrandTotal(): number {
        return this.getData('base_grand_total');
    }

    setBaseGrandTotal(total: number): Quote {
        return <any>this.setData('base_grand_total', total);
    }

    setSubtotalWithDiscount(total: number): Quote {
        return <any>this.setData('subtotal_with_discount', total);
    }

    setBaseSubtotalWithDiscount(total: number): Quote {
        return <any>this.setData('base_subtotal_with_discount', total);
    }

    getSubtotalWithDiscount(): number {
        return this.getData('subtotal_with_discount');
    }

    getBaseSubtotalWithDiscount(): number {
        return this.getData('base_subtotal_with_discount');
    }

    setTotalsCollectedFlag(flag: boolean): Quote {
        this.setData('totals_collected_flag', flag);
        return this;
    }

    getCustomerSession(): Session {
        return ObjectManager.getInstance().get<Session>(Session.CODE_INSTANCE, Session);
    }

    getCustomer(): Customer {
        return this.getCustomerSession().getCustomer();
    }

    setCustomer(customer: Customer): Quote {
        this.getCustomerSession().setCustomer(customer);
        return this;
    }
    
    removeCustomer():Quote{
      this.getCustomerSession().removeCustomer();
      return this;
    }

    getSetting(): SettingManagement {
        return ObjectManager.getInstance().get<SettingManagement>(SettingManagement.CODE_INSTANCE, SettingManagement);
    }

    setStore(store: Store): Quote {
        this.setData('store', store);
        return this;
    }

    removeAllItems(): Quote {
        this._items = [];
        return this;
    }

    removeAllAddresses(): Quote {
        this._addresses = [];
        return this;
    }

    addRetailAdditionData(key: string, value: any) {
        this._retailAdditionData[key] = value;
        return this;
    }

    getRetailAdditionData() {
        return this._retailAdditionData;
    }

    resetRetailAdditionData() {
        this._retailAdditionData = {};
    }

}
