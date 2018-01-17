import {AfterViewInit, ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
             // moduleId: module.id,
             selector: 'paypal-button-component',
             templateUrl: 'paypal-button.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush,
           })

export class PaypalButtonComponent implements OnInit, AfterViewInit {
  
  constructor() { }
  
  ngOnInit() {
  
  }
  
  ngAfterViewInit(): void {
    // paypal.Button.render({
    //
    //                        env: 'sandbox', // sandbox | production
    //
    //                        // PayPal Client IDs - replace with your own
    //                        // Create a PayPal app: https://developer.paypal.com/developer/applications/create
    //                        client: {
    //                          sandbox: 'AaJY1ddCA5GZgg0KLItdAlFQhf3Vpj35Vcy2h6MplD1Dv2qMl776lu5vEI9yZLDDvE6MSGlm09_-_Pm1',
    //                          production: '<insert production client id>'
    //                        },
    //
    //                        // Show the buyer a 'Pay Now' button in the checkout flow
    //                        commit: true,
    //
    //                        // payment() is called when the button is clicked
    //                        payment: (data, actions) => {
    //
    //                          // Make a call to the REST api to create the payment
    //                          return actions.payment.create({
    //                                                          payment: {
    //                                                            transactions: [
    //                                                              {
    //                                                                amount: {total: '100', currency: 'USD'}
    //                                                              }
    //                                                            ]
    //                                                          }
    //                                                        });
    //                        },
    //
    //                        // onAuthorize() is called when the buyer approves the payment
    //                        onAuthorize: (data, actions) => {
    //
    //                          // Make a call to the REST api to execute the payment
    //                          return actions.payment.execute().then(() => {
    //                            window.alert('Payment Complete!');
    //                          });
    //                        }
    //
    //                      }, '#paypal-button-container');
  
    paypal.checkout.setup('AaJY1ddCA5GZgg0KLItdAlFQhf3Vpj35Vcy2h6MplD1Dv2qMl776lu5vEI9yZLDDvE6MSGlm09_-_Pm1', {
      environment: 'sandbox',
      container: 'myContainer'
    });
  }
}
