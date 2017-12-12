import {Injectable} from '@angular/core';
import * as dropin from 'braintree-web-drop-in';
import {BrainTreeMeteorServer} from "./braintree/server";
import {GeneralException} from "../../../../../../code/GeneralException";

@Injectable()
export class Braintree {
  
  protected braintreeFormInstance;
  
  constructor(protected server: BrainTreeMeteorServer) {
  }
  
  initClient() {
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
          
              this.braintreeFormInstance = instance;
          
              // button.addEventListener('click', () => {
              //   instance.requestPaymentMethod((requestPaymentMethodErr, payload) => {
              //     if (requestPaymentMethodErr) {
              //       // No payment method is available.
              //       // An appropriate error will be shown in the UI.
              //       return;
              //     }
              //     console.log(payload);
              //     // Submit payload.nonce to your server
              //   });
              // });
          
              resolve(instance);
            });
          }, (err) => {
            reject(err);
          });
    });
  }
  
  requestPaymentMethod(planId) {
    if (typeof this.braintreeFormInstance === 'undefined') {
      throw new GeneralException("braintree_has_not_initialized");
    }
    
    return new Promise((resolve, reject) => {
      this.braintreeFormInstance.requestPaymentMethod((requestPaymentMethodErr, payload) => {
        if (requestPaymentMethodErr) {
          // No payment method is available.
          // An appropriate error will be shown in the UI.
          return reject(requestPaymentMethodErr);
        }
        // Submit payload.nonce to your server
        if (payload.nonce) {
          this.server.pay(planId, {
            paymentMethodNonce: payload.nonce,
            id: 'braintree'
          }).then((res) => resolve(res), (err) => reject(err));
        }
      });
    });
  }
}
