import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";
import {PosState} from "../R/index";
import {PosGeneralActions} from "../R/general/general.actions";

@Injectable()
export class FakeService {
  
  constructor(private store: Store<PosState>,
              private posGeneralActions: PosGeneralActions) { }
  
  fakeGeneralData() {
    this.posGeneralActions.selectOutlet({id: 1});
    this.posGeneralActions.selectRegister({id: 1});
    this.posGeneralActions.selectWebsite({baseUrl: 'http://mage2.dev'});
  }
}
