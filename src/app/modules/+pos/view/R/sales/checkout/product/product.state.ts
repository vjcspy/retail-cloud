import {List} from "immutable";
import {makeTypedFactory, TypedRecord} from "typed-immutable-record";

export interface CheckoutProductState {
  isCategoryMode: boolean;
  categoryHeight: Object;
  productsStyles: Object;
  
  isGridMode: boolean;
  currentCategory: Object;
  categoryList: List<any>;
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
  
  bufferPageView: number;
}

export interface CheckoutProductStateRecord extends TypedRecord<any>, CheckoutProductState {}

export const checkoutProductStateFactory = makeTypedFactory<CheckoutProductState, CheckoutProductStateRecord>(
  {
    isCategoryMode: true,
    categoryHeight: {
      totalCategoryHeight: 0,
      breadcrumbHeight: 0
    },
    productsStyles: {},
    
    isGridMode: true,
    currentCategory: null,
    categoryList: List.of(),
    searchString: null,
    searchStringPattern: null, // Để kiểm tra xem nếu là search giống như parttern hiện tại hoặc là khác thì break;
    
    
    productGridStyles: {},
    productGridHeight: null,
    productGridWidth: null,
    productGridCurrentPage: 1,
    productGridNumOfProductPerPage: 20,
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
    productGridPagingData: [],
    
    bufferPageView: 1, // new UI, số lượng page hiển thị ra được buffer thêm bao nhiêu
  });
