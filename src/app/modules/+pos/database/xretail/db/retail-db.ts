import Dexie from 'dexie';
import {ProductDB} from "./product";
import {CustomerDB} from "./customer";
import {EntityInformation} from "./entity-information";
import {StoreDB} from "./store";
import {TaxDB} from "./tax";
import {SettingDB} from "./setting";
import {CountryDB} from "./country";
import {TaxClassDB} from "./tax-class";
import {CustomerGroupDB} from "./customer-group";
import {RetailConfigDB} from "./retail-config";
import {OutletDB} from "./outlet";
import {CategoryDB} from "./category";
import {OrderOnholdDB} from "./order-onhold";
import {OrderDB} from "./order";
import {UserOrderCountDB} from "./user-order-count";
import {ShiftDB} from "./shift";
import {PaymentDB} from "./payment";
import {ReceiptDB} from "./receipt";
import {WarehouseDB} from "./warehouse";
import {PermissionDB} from "./permission";

export class RetailDB extends Dexie {
    entityInformation: Dexie.Table<EntityInformation, string>;
    stores: Dexie.Table<StoreDB, number>;
    products: Dexie.Table<ProductDB, number>;
    customers: Dexie.Table<CustomerDB, number>;
    taxes: Dexie.Table<TaxDB, number>;
    settings: Dexie.Table<SettingDB, number>;
    countries: Dexie.Table<CountryDB, string>;
    taxClass: Dexie.Table<TaxClassDB, string>;
    customerGroup: Dexie.Table<CustomerGroupDB, string>;
    retailConfig: Dexie.Table<RetailConfigDB, string>;
    outlet: Dexie.Table<OutletDB, number>;
    category: Dexie.Table<CategoryDB, string>;
    orderOnhold: Dexie.Table<OrderOnholdDB, string>;
    orders: Dexie.Table<OrderDB, string>;
    userOrderCount: Dexie.Table<UserOrderCountDB, string>;
    shifts: Dexie.Table<ShiftDB, string>;
    payment: Dexie.Table<PaymentDB, string>;
    receipts: Dexie.Table<ReceiptDB, string>;
    warehouse: Dexie.Table<WarehouseDB, string>;
    permission: Dexie.Table<PermissionDB, string>;
    
    constructor() {
        console.log('%c Init DB! ', 'color: #bada55');
        super("RetailDB");
        let db = this;
        
        db.version(1).stores(
            {
                entityInformation: EntityInformation.getFields(),
                stores: StoreDB.getFields(),
                products: ProductDB.getFields(),
                customers: CustomerDB.getFields(),
                taxes: TaxDB.getFields(),
                settings: SettingDB.getFields(),
                countries: CountryDB.getFields(),
                taxClass: TaxClassDB.getFields(),
                customerGroup: CustomerGroupDB.getFields(),
                retailConfig: RetailConfigDB.getFields(),
                outlet: OutletDB.getFields(),
                category: CategoryDB.getFields(),
                orderOnhold: OrderOnholdDB.getFields(),
                orders: OrderDB.getFields(),
                userOrderCount: UserOrderCountDB.getFields(),
                shifts: ShiftDB.getFields(),
                payment: PaymentDB.getFields(),
                receipts: ReceiptDB.getFields(),
                warehouse: WarehouseDB.getFields(),
                permission: PermissionDB.getFields(),
            });
        
        // Map physic class to database object
        db.stores.mapToClass(StoreDB);
        db.taxes.mapToClass(TaxDB);
        db.settings.mapToClass(SettingDB);
        db.products.mapToClass(ProductDB);
        db.customers.mapToClass(CustomerDB);
        db.entityInformation.mapToClass(EntityInformation);
        db.countries.mapToClass(CountryDB);
        db.taxClass.mapToClass(TaxClassDB);
        db.customerGroup.mapToClass(CustomerGroupDB);
        db.retailConfig.mapToClass(RetailConfigDB);
        db.outlet.mapToClass(OutletDB);
        db.category.mapToClass(CategoryDB);
        db.orderOnhold.mapToClass(OrderOnholdDB);
        db.orders.mapToClass(OrderDB);
        db.userOrderCount.mapToClass(UserOrderCountDB);
        db.shifts.mapToClass(ShiftDB);
        db.payment.mapToClass(PaymentDB);
        db.receipts.mapToClass(ReceiptDB);
        db.warehouse.mapToClass(WarehouseDB);
        db.permission.mapToClass(PermissionDB);
    }
}
if (!window.hasOwnProperty('retailDB')) {
    window['retailDB'] = new RetailDB();
}
export const db:RetailDB = window['retailDB'];
