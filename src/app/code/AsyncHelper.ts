import * as _ from 'lodash';

export class AsyncHelper {
  static async forEach(e: any, callBack: (v, k) => Promise<any>): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const size = _.size(e);
        let work   = 0;
        if (size === 0) {
          resolve();
        } else {
          _.forEach(e, async (v, k) => {
            await callBack(v, k);
            if (++work === size) {
              resolve();
            }
          });
        }
      } catch (e) {
        reject(e);
      }
    })
  }
}
