import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";
import {Actions, Effect} from "@ngrx/effects";
import {PosEntitiesActions} from "../../../../R/entities/entities.actions";
import {OutletDB} from "../../../../database/xretail/db/outlet";
import {ConfigurationsOutletActions} from "./outlet.actions";
import {PosEntitiesState} from "../../../../R/entities/entities.state";
import * as _ from 'lodash';

@Injectable()
export class ConfigurationsOutletEffects {
  
  constructor(private store$: Store<any>,
              private actions$: Actions,
              private configurationsOutletActions: ConfigurationsOutletActions) { }
  
  @Effect() saveStoreData = this.actions$
                                .ofType(
                                  PosEntitiesActions.ACTION_PULL_ENTITY_SUCCESS,
                                  ConfigurationsOutletActions.ACTION_UPDATE_OUTLET_FILTER
                                )
                                .filter((action: Action) => {
                                  return !!action.payload['entityCode'] ? action.payload['entityCode'] === OutletDB.getCode() : true;
                                })
                                .withLatestFrom(this.store$.select('entities'))
                                .withLatestFrom(this.store$.select('configurations'), (z, z1) => [...z, z1])
                                .map((z) => {
                                  console.log('here');
                                  const outlets    = (z[1] as PosEntitiesState).outlet.items;
                                  const filterData = <any>z[2].outlets.filterData;
    
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
    
                                  outletFiltered = outletFiltered.sortBy((o) => parseInt(o['id']));
    
                                  return this.configurationsOutletActions.resolveOutlet(outletFiltered, false);
                                });
}
