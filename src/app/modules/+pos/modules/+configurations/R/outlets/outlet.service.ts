import {Injectable} from '@angular/core';
import {List} from "immutable";
import * as _ from 'lodash';
import {PosGeneralState} from "../../../../R/general/general.state";
import {RequestService} from "../../../../../../services/request";
import {ApiManager} from "../../../../../../services/api-manager";

@Injectable()
export class ConfigurationsOutletService {
  editOutletFormData = {
    outlet: {},
    registers: List.of(),
    register: {}
  };
  
  constructor(private requestService: RequestService,
              private apiUrlManager: ApiManager) {}
  
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
  
  createSaveOutletRequest(outlet, generalState: PosGeneralState) {
    return this.requestService
               .makePost(this.apiUrlManager.get("outlet", generalState.baseUrl), {data: outlet});
  }
  
  createSaveRegister(register: any, generalState: PosGeneralState) {
    return this.requestService.makePost(
      this.apiUrlManager.get("register", generalState.baseUrl),
      {data: register}
    );
  }
  
  createDeleteRegister(register: any, generalState: PosGeneralState) {
    return this.requestService.makeDelete(this.apiUrlManager.get("register", generalState.baseUrl) + "?id=" + register['id'] + "&outlet_id=" + register['outlet_id']
    );
  }
}
