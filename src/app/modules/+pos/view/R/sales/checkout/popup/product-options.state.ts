import {Product} from "../../../../../core/framework/catalog/Model/Product";
import {DataObject} from "../../../../../core/framework/General/DataObject";

export interface ProductOptionsState {
  productOptions: {
    tabView: string;
    options: Object;
    super_attribute: Object,
    bundle_option: Object,
    bundle_option_qty: Object,
    super_group: Object,
    isOpenProductDetailPopup: boolean;
    product: Product;
    buyRequest: DataObject;
  };
}
