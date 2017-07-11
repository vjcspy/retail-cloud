import {Injectable} from '@angular/core';
import {List} from "immutable";
import * as _ from 'lodash';

@Injectable()
export class ConfigurationsOutletService {
  editOutletFormData = {
    outlet: {},
    registers: List.of()
  };
  
  resolveFilterOutlets(outlets: List<any>, filterData) {
    let outletFiltered = outlets.filter((outlet) => {
      if (!!filterData.id && parseInt(outlet['id']) !== parseInt(filterData.id)) {
        return false;
      }
      
      if (!!filterData.store_id && filterData.store_id !== 'AllStore' && parseInt(outlet['store_id']) !== parseInt(filterData.store_id)) {
        return false;
      }
      
      if (filterData.is_active !== null && filterData.is_active !== 'AllStatus' && outlet['is_active'] !== filterData.is_active) {
        return false;
      }
      
      if (!!filterData.name) {
        let reString: string = "";
        _.forEach(_.split(filterData.name, " "), (v) => {
          if (!_.isString(v) || v === '' || v === null) {
            return true;
          }
          //noinspection TypeScriptUnresolvedFunction
          v = _.toLower(v);
          // escape regular expression special characters
          v = v.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
          reString += ".*(" + v + "){1}";
        });
        
        reString += ".*";
        let re = RegExp(reString, "gi");
        
        return re.test(outlet['name']);
      }
      return true;
    });
    
    return outletFiltered.sortBy((o) => parseInt(o['id']));
    
  }
}
