import {DataObject} from "../../../../../General/DataObject";
export class ItemDetails extends DataObject {
    setCode(code: string): ItemDetails {
        return <any>this.setData('code', code);
    }

    setQuantity(qty: number): ItemDetails {
        return <any>this.setData('qty', qty);
    }

    setTaxClassKey(taxClassKey: DataObject): ItemDetails {
        return <any>this.setData('tax_class_key', taxClassKey);
    }

    setIsTaxIncluded(isIncludedTax: boolean): ItemDetails {
        return <any>this.setData('is_tax_included', isIncludedTax);
    }

    setType(type: string): ItemDetails {
        return <any>this.setData('type', type);
    }

    setBaseTaxCalculationPrice(price: number): ItemDetails {
        return <any>this.setData('base_tax_calculation_price', price);
    }

    getBaseTaxCalculationPrice(): number {
        return this.getData('base_tax_calculation_price');
    }

    setUnitPrice(price: number): ItemDetails {
        return <any>this.setData('unit_price', price);
    }

    getUnitPrice(): number {
        return this.getData('unit_price');
    }

    setDiscountAmount(discount: number): ItemDetails {
        return <any>this.setData('discount_amount', discount);
    }

    setTaxCalculationPrice(price: number): ItemDetails {
        return <any>this.setData('tax_calculation_price', price);
    }

    getTaxCalculationPrice(): number {
        return this.getData('tax_calculation_price');
    }

    setParentCode(code: string): ItemDetails {
        return <any>this.setData('parent_code', code);
    }
}