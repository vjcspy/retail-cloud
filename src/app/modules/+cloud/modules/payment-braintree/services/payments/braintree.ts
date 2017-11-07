import {Injectable} from '@angular/core';
import * as dropin from 'braintree-web-drop-in';
import {BrainTreeMeteorServer} from "./braintree/server";

@Injectable()
export class Braintree {
  
  constructor(protected server: BrainTreeMeteorServer) {
  }
  
  initClient(button: Element) {
    return new Promise((resolve, reject) => {
      this.server.getClientToken()
          .then((res) => {
            dropin.create({
                            authorization: res,
                            container: '#dropin-container'
                          }, (createErr, instance) => {
              if (createErr) {
                // An error in the create call is likely due to
                // incorrect configuration values or network issues.
                // An appropriate error will be shown in the UI.
                return reject(createErr);
              }
          
              button.addEventListener('click', () => {
                instance.requestPaymentMethod((requestPaymentMethodErr, payload) => {
                  if (requestPaymentMethodErr) {
                    // No payment method is available.
                    // An appropriate error will be shown in the UI.
                    return;
                  }
                  console.log(payload);
                  // Submit payload.nonce to your server
                });
              });
          
              resolve(instance);
            });
          }, (err) => {
            reject(err);
          });
    });
  }
}
