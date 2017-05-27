import {AbstractTotal} from "./AbstractTotal";
import * as _ from "lodash";
import {Quote} from "../../../Quote";
import {Address} from "../../Address";
import {Total} from "../Total";
import {Store} from "../../../../../store/Model/Store";
import {Item} from "../../Item";
export class Shipping extends AbstractTotal {
    // checkout order sort order
    protected _totalSortOrder = 40;

    static SHIPPING_AMOUNT = 0;

    private _store: Store;

    constructor() {
        super();
        this._canAddAmountToAddress = true;
        this._canSetAddressAmount   = true;
        this.setCode('shipping');
    }

    collect(quote: Quote, address: Address, total: Total): Shipping {
        super.collect(quote, address, total);

        this._store = address.getQuote().getStore();

        let items      = address.getItems();
        let addressQty = 0;
        _.forEach(items, (item: Item) => {
            if (item.getProduct().isVirtual())
                return true;
            if (item.getParentItem())
                return true;
            if (item.getHasChildren()) {
                _.forEach(item.getChildren(), (child: Item) => {
                    if (child.getProduct().isVirtual()) {
                        return true;
                    }
                    addressQty += child.getTotalQty();
                });
            } else {
                if (!item.getProduct().isVirtual()) {
                    addressQty += item.getQty();
                }
            }
        });
        address.setData('item_qty', addressQty);
        this._setAmount(this.getShippingAmount());
        this._setBaseAmount(this.getBaseShippingAmount());
        address.setData('shipping_amount', this.getShippingAmount());
        address.setData('base_shipping_amount', this.getShippingAmount());

        return this;
    }

    getShippingAmount(): number {
        return Shipping.SHIPPING_AMOUNT;
    }

    getBaseShippingAmount() {
        return this.getShippingAmount() / this._store.convertPrice(1);
    }
}