import {ShareInstance} from "../General/ObjectManager/ShareInstance";
import {SettingDB} from "../../../database/xretail/db/setting";

export class SettingManagement implements ShareInstance {
    static CODE_INSTANCE = "SettingManagement";
    private static _INSTANCE: SettingDB;

    getInstance(): SettingDB {
        if (typeof SettingManagement._INSTANCE == "undefined") {
            SettingManagement._INSTANCE = new SettingDB();
        }
        return SettingManagement._INSTANCE;
    }

    getConfig(group: string, key: string): any {
        return <any>SettingDB.getStoreConfig(group, key);
    }

    getStoreConfigGroup(group: string): any {
        return SettingDB.getStoreConfigGroup(group);
    }
}