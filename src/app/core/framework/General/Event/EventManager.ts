import {EventContainer} from "./EventContainer";
import * as _ from "lodash";
import {Event} from "./Event";
export class EventManager {

    static dispatch(eventName: string, data: Object): void {
        eventName = _.snakeCase(eventName);

        _.forEach(EventContainer.getEvents(eventName), (event: Event)=> {
            let eventInstance = event.create();
            eventInstance.execute(data);
        });
    }
}