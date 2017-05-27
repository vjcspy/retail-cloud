import {Address} from "../../Address";
import {Quote} from "../../../Quote";
import {Total} from "../Total";
import {Session} from "../../../../../customer/Model/Session";
import {ObjectManager} from "../../../../../General/App/ObjectManager";
export class AbstractTotal {
    protected _totalSortOrder: number = 0;
    protected _code: string;
    protected _address: Address;
    protected total: Total;
    protected _canSetAddressAmount: boolean;
    protected _canAddAmountToAddress: boolean;

    setCode(code: string): AbstractTotal {
        this._code = code;
        return this;
    }

    getCode(): string {
        return this._code;
    }

    getLabel(): string {
        return "";
    }

    collect(quote: Quote,
            address: Address,
            total: Total) {
        this._setAddress(address);
        this._setTotal(total);

        this._setAmount(0);
        this._setBaseAmount(0);
    }

    protected _setAddress(address: Address): AbstractTotal {
        this._address = address;
        return this;
    }

    protected _getAddress(): Address {
        return this._address;
    }

    protected _setTotal(total: Total): AbstractTotal {
        this.total = total;
        return this;
    }

    protected _getTotal(): Total {
        return this.total;
    }

    protected _setAmount(amount: number): AbstractTotal {
        if (this._canSetAddressAmount) {
            this._getAddress().setTotalAmount(this.getCode(), amount);
        }
        return this;
    }

    protected _setBaseAmount(amount: number): AbstractTotal {
        if (this._canSetAddressAmount) {
            this._getAddress().setBaseTotalAmount(this.getCode(), amount);
        }
        return this;
    }

    protected _addAmount(amount: number): AbstractTotal {
        if (this._canAddAmountToAddress) {
            this._getAddress().addTotalAmount(this.getCode(), amount);
        }
        return this;
    }

    protected _addBaseAmount(amount: number): AbstractTotal {
        if (this._canAddAmountToAddress) {
            this._getAddress().addBaseTotalAmount(this.getCode(), amount);
        }
        return this;
    }

    protected getCustomerSession(): Session {
        return ObjectManager.getInstance().get<Session>(Session.CODE_INSTANCE, Session);
    }


    getTotalSortOrder(): number {
        return this._totalSortOrder;
    }
}