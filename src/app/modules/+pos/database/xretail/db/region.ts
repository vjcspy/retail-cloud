import {DataObject} from "../../../core/framework/General/DataObject";

export class RegionDB extends DataObject {
  id: number;
  name: string;
  assigned_outlets: Object[];
  
  static getFields(): string {
    return "id,region_name,assigned_outlets";
  }
  
  static getCode(): string {
    return 'region';
  }
  
  save(region: any = null): Promise<any> {
    return new Promise((resolve, reject) => {
      window['retailDB'].region.put(region === null ? this : region).then((result) => {
        return resolve();
      }).catch((error) => {
        return reject(error);
      });
    });
  }
  
  delete(id: number, key: string = 'id') {
    return new Promise((resolve, reject) => {
      window['retailDB'].region
                        .where(key).equals(id)
                        .delete()
                        .then((deleteCount) => {
                          return resolve();
                        })
                        .catch((e) => {
                          return reject(e);
                        });
    });
  }
}
