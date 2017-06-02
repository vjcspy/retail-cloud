import {makeTypedFactory, TypedRecord} from "typed-immutable-record";
import {List} from "immutable";

// Dùng trong service hoặc component... Không thể sửa giá trị
export interface CheckoutState {
  isCategoryMode: boolean;
  isGridMode: boolean;
  currentCategory: Object;
  searchString: string;
  searchStringPattern: string;
  
  productGridStyles: Object;
  productGridWidth: number;
  productGridHeight: number;
  productGridProducts: List<any>;
  productGridCurrentPage: number;
  productGridTotalsPage: number;
  productGridNumOfProductPerPage: number;
  productGridStyleValue: Object;
  productGridPagingData: any[];
}

// Typed thực sự của state dùng trong reducer
export interface CheckoutStateRecord extends TypedRecord<any>, CheckoutState {}

export const checkoutStateFactory = makeTypedFactory<CheckoutState, CheckoutStateRecord>(
  {
    isCategoryMode: false,
    isGridMode: true,
    currentCategory: null,
    searchString: null,
    searchStringPattern: null, // Để kiểm tra xem nếu là search giống như parttern hiện tại hoặc là khác thì break;
    
    productGridStyles: {},
    productGridHeight: null,
    productGridWidth: null,
    productGridCurrentPage: 1,
    productGridNumOfProductPerPage: 0,
    productGridStyleValue: {
      marginProductLeftRight: 10, // totals margin left and right each product image
      marginProductTop: 10, // margin top each product image
      baseWidthProductGrid: 190, // width product image
      paddingGrid: 40, // padding product-grid-inner 20px * 2
      stretchLengthRatioAllows: 1.37, // Tỷ lệ giãn chiều dài cho phép
      stretchAspectRatioAllows: 0.86 // Tỷ lệ co chiều dài cho phép
    },
    productGridTotalsPage: 0,
    productGridProducts: List.of(),
    productGridPagingData: []
  });
