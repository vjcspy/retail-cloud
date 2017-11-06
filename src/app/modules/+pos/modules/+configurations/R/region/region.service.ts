import {Injectable} from '@angular/core';
import {List} from "immutable";
import * as _ from 'lodash';
import {PosGeneralState} from "../../../../R/general/general.state";
import {RequestService} from "../../../../../../services/request";
import {ApiManager} from "../../../../../../services/api-manager";

@Injectable()
export class ConfigurationsRegionService {
  constructor(private requestService: RequestService,
              private apiUrlManager: ApiManager) {}
  editRegionFormData = {};
  
  resolveFilterRegion(regions: List<any>, filterData) {
    let regionFiltered = regions.filter((region) => {
      if (!!filterData.id && parseInt(region['id']) !== parseInt(filterData.id)) {
        return false;
      }
      if (!!filterData.region_name) {
        let reString: string = "";
        _.forEach(_.split(filterData.region_name, " "), (v) => {
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
        
        return re.test(region['region_name']);
      }
      
      if (!!filterData.assigned_outlets) {
        let reString: string = "";
        _.forEach(_.split(filterData.assigned_outlets, " "), (v) => {
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
  
  // region['assigned_outlets'] = this.outletHelper.getOutletById()
        return re.test(region['assigned_outlets']);
      }
      return true;
    });
    
    return regionFiltered.sortBy((o) => parseInt(o['id']));
  }
  
  createSaveRegionRequest(region, generalState: PosGeneralState) {
    return this.requestService
               .makePost(this.apiUrlManager.get("region", generalState.baseUrl), {data: region});
  }
  
  createDeleteRegionRequest(id , generalState: PosGeneralState) {
    return this.requestService
               .makeDelete(this.apiUrlManager.get('region', generalState.baseUrl) + "?id=" + id);
  }
}
