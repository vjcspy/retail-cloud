import * as _ from "lodash";

export class WarehouseHelper {
  public static getWarehouseSelectData(warehouse: any[]) {
    let selectData = {
      data: []
    };

    _.forEach(warehouse, (r) => {
      selectData['data'].push({label: r['name'], value: r['id']});
    });

    return selectData;
  }
}
