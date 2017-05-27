import {DataObject} from "../../../core/framework/General/DataObject";

export class PermissionDB extends DataObject {
    id: string;
    role_id: string;
    group: string;
    permission: string;
    is_active: boolean;
    
    static getFields(): string {
        return "id,role_id,group,permission,is_active";
    }
    
    static getCode(): string {
        return 'permission';
    }
}
