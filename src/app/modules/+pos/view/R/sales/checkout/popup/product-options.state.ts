import {Product} from "../../../../../core/framework/catalog/Model/Product";
import {DataObject} from "../../../../../core/framework/General/DataObject";
import {makeTypedFactory, TypedRecord} from "typed-immutable-record";

export interface ProductOptionsState {
  tabView: string;
  data: {
    options: Object;
    super_attribute: Object;
    bundle_option: Object;
    bundle_option_qty: Object;
    super_group: Object;
  };
  isOpenProductDetailPopup: boolean;
  product: Product;
  buyRequest: DataObject;
  currentProcessing: string; // add new - edit
}

export interface ProductOptionsStateRecord extends TypedRecord<any>, ProductOptionsState {}


export const productOptionsStateFactory = makeTypedFactory<ProductOptionsState, ProductOptionsStateRecord>(
  {
    tabView: 'option',
    data: {
      options: {},
      super_attribute: {},
      bundle_option: {},
      bundle_option_qty: {},
      super_group: {}
    },
    isOpenProductDetailPopup: false,
    product: null,
    buyRequest: null,
    currentProcessing: 'addNew'
  });
