export class ProductHelper {
    protected _skipSaleableCheck = true;


    getSkipSaleableCheck(): boolean {
        return this._skipSaleableCheck;
    }
}