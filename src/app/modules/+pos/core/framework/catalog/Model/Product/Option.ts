import {DataObject} from "../../../General/DataObject";
import {GeneralException} from "../../../General/Exception/GeneralException";
import {DefaultType} from "./Option/Type/DefaultType";
import {Text} from "./Option/Type/Text";
import {File} from "./Option/Type/File";
import {Select} from "./Option/Type/Select";
import {Date} from "./Option/Type/Date";
import {Value} from "./Option/Value";
import * as _ from "lodash";
export class Option extends DataObject {
    static OPTION_GROUP_TEXT = 'text';

    static OPTION_GROUP_FILE = 'file';

    static OPTION_GROUP_SELECT = 'select';

    static OPTION_GROUP_DATE = 'date';

    static OPTION_TYPE_FIELD = 'field';

    static OPTION_TYPE_AREA = 'area';

    static OPTION_TYPE_FILE = 'file';

    static OPTION_TYPE_DROP_DOWN = 'drop_down';

    static OPTION_TYPE_RADIO = 'radio';

    static OPTION_TYPE_CHECKBOX = 'checkbox';

    static OPTION_TYPE_MULTIPLE = 'multiple';

    static OPTION_TYPE_DATE = 'date';

    static OPTION_TYPE_DATE_TIME = 'date_time';

    static OPTION_TYPE_TIME = 'time';

    groupFactory(type: string): DefaultType {
        let group = this.getGroupByType(type);
        if (!group)
            throw new GeneralException("The option type to get group instance is incorrect.");
        return group;
    }

    getGroupByType(type: string = null): DefaultType {
        if (type == null)
            type = this.getData('type');

        let group: DefaultType;
        switch (type) {
            case Option.OPTION_TYPE_FIELD:
            case Option.OPTION_GROUP_TEXT:
            case Option.OPTION_TYPE_AREA:
                group = new Text();
                break;
            case Option.OPTION_TYPE_FILE:
                group = new File();
                break;
            case Option.OPTION_TYPE_DROP_DOWN:
            case Option.OPTION_TYPE_RADIO:
            case Option.OPTION_TYPE_CHECKBOX:
            case Option.OPTION_TYPE_MULTIPLE:
                group = new Select();
                break;
            case Option.OPTION_TYPE_DATE:
            case Option.OPTION_TYPE_DATE_TIME:
            case Option.OPTION_TYPE_TIME:
                group = new Date();
                break;
        }
        return group;
    }

    getPrice(): number {
        return parseFloat(this.getData('price'));
    }

    getPriceType(): string {
        return this.getData('price_type');
    }

    getType(): string {
        return this.getData('type');
    }

    getValueById(id): Value {
        let _data = _.find(this.getData('data'), o => o['option_type_id'] == id);
        if (_data) {
            let value = new Value();
            value.addData(_data);

            return value;
        }
        return null;
    }
}