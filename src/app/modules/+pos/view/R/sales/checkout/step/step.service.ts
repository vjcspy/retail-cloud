import {Injectable} from '@angular/core';

@Injectable()
export class PosStepService {
  /* For payment gateway.
   * It need pay success before save order
   */
  private _beforeSaveOrderTask = {};
  
  constructor() { }
  
  addTaskBeforeSaveOrder(id: string, canSaveOrder: () => boolean): PosStepService {
    this._beforeSaveOrderTask[id] = canSaveOrder;
    
    return this;
  }
  
  removeTaskBeforeSaveOrder(id: string): PosStepService {
    delete this._beforeSaveOrderTask[id];
    
    return this;
  }
  
  resolveTaskBeforeSaveOrder(): Promise<boolean> {
    return new Promise(async (resolve) => {
      const keys   = Object.keys(this._beforeSaveOrderTask);
      const length = keys.length;
      
      for (let i = 0; i < length; i++) {
        let canSaveOrder = await this._beforeSaveOrderTask[keys[i]]();
        
        if (canSaveOrder === false) {
          resolve(false);
        }
      }
      
      resolve(true);
    });
  }
}
