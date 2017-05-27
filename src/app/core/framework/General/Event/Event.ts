import {ObserverInterface} from "./ObserverInterface";
import {DataObject} from "../DataObject";
export abstract class Event extends DataObject {
    abstract create(): ObserverInterface;

    setName(eventName): Event {
        this.setData('name', eventName);
        return this;
    }
}