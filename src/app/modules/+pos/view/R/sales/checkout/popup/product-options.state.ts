import {Product} from "../../../../../core/framework/catalog/Model/Product";
import {DataObject} from "../../../../../core/framework/General/DataObject";
import {makeTypedFactory, TypedRecord} from "typed-immutable-record";
import {List} from "immutable";

export interface OptionData {
  options: {};
  super_attribute: Object;
  bundle_option: Object;
  bundle_option_qty: Object;
  super_group: Object;
  gift_card: Object;
}

export interface OptionDataRecord extends TypedRecord<any>, OptionData {
}

export const optionDataFactory = makeTypedFactory<OptionData, OptionDataRecord>(
  {
    options: {},
    super_attribute: {},
    bundle_option: {},
    bundle_option_qty: {},
    super_group: {},
    gift_card: {},
  });

export interface ProductOptionsState {
  tabView: string;
  optionData: OptionDataRecord;
  isOpenProductDetailPopup: boolean;
  product: Product;
  buyRequest: DataObject;
  currentProcessing: string; // add new - edit
  warehouseItem: List<any>; // product in each warehouse
}

export interface ProductOptionsStateRecord extends TypedRecord<any>, ProductOptionsState {
}

export const productOptionsStateFactory = makeTypedFactory<ProductOptionsState, ProductOptionsStateRecord>(
  {
    tabView: 'option',
    optionData: optionDataFactory(),
    isOpenProductDetailPopup: false,
    product: null,
    buyRequest: null,
    currentProcessing: 'ADD_NEW',
    warehouseItem: List.of()
  });
