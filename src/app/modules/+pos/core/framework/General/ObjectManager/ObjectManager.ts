import * as _ from "lodash";
export class ObjectManager {
    protected _sharedInstance = {};

    create<T>(context: Object, name: any, ...args: any[]): T {
        var instance = Object.create(name.prototype);
        instance.constructor.apply(instance, args);
        return <T> instance;
    }

    get<T>(identify: string, name: any, ...args: any[]): T {
        if (!this._sharedInstance.hasOwnProperty(identify)) {
            let instance = Object.create(name.prototype);
            if (!_.isEmpty(args))
                instance.constructor.apply(instance, args);
            this._sharedInstance[identify] = instance;
        }
        return <T>this._sharedInstance[identify];
    }
}