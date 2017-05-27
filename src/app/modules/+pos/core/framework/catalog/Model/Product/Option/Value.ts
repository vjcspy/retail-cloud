import {DataObject} from "../../../../General/DataObject";

export class Value extends DataObject {
    getPrice(): number {
        return parseFloat(this.getData('price'));
    }

    getPriceType(): string {
        return this.getData('price_type');
    }
}
