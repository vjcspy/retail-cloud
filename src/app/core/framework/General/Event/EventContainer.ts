import {DataObject} from "../DataObject";
import {Event} from "./Event";
import * as _ from "lodash";

export class EventContainer extends DataObject {
    static _eventContainer: Object = {};
    
    static fresh() {
        EventContainer._eventContainer = {};
    }
    
    static addEventHandle(eventName: string, eventConfig: Event, priority = 0): void {
        eventName = _.snakeCase(eventName);
        if (!EventContainer._eventContainer.hasOwnProperty(eventName)) {
            EventContainer._eventContainer[eventName] = [];
        }
        EventContainer._eventContainer[eventName].push({priority: priority, eventConfig: eventConfig});
    }
    
    static getEvents(eventName: string): Event[] {
        eventName = _.snakeCase(eventName);
        if (EventContainer._eventContainer.hasOwnProperty(eventName)) {
            return <Event[]>_.map(_.sortBy(this._eventContainer[eventName], [(o) => o.priority]), 'eventConfig');
        }
        else
            return null;
    }
}
