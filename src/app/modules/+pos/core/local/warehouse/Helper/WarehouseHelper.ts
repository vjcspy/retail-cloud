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
    static getWarehouseById(warehouse: any[], warehouseId) {
        let _warehouse = _.find(warehouse, (wh) => parseInt(wh['id']) === parseInt(warehouseId));
        return _warehouse ? _warehouse : null;
    }
}
