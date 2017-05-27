import {DataObject} from "../../../../General/DataObject";
export class Option extends DataObject {
    getValue(): any {
        return this.getData('value');
    }
}