import {Store} from "./Store";
import {GeneralException} from "../../General/Exception/GeneralException";
import {ShareInstance} from "../../General/ObjectManager/ShareInstance";
export class StoreManager implements ShareInstance {
    static CODE_INSTANCE           = "StoreManager";
    static _storeInstance          = null;
    static _currentStoreId: number = null;

    static setStore(store: Store) {
        StoreManager._storeInstance = store;
    }

    static getStore(): Store {
        if (StoreManager._storeInstance === null)
            throw new GeneralException("Store not yet set!");
        return StoreManager._storeInstance;
    }

    static setCurrentStoreId(storeId: number) {
        this._currentStoreId = storeId;
    }
}
