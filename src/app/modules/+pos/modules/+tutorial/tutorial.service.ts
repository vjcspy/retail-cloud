import {Injectable} from '@angular/core';

@Injectable()
export class TutorialService {
  public template = `<div class='popover tour'>
                    <div class='arrow'></div>
                    <h3 class='popover-title'></h3>
                    <div class='popover-content'></div>
                    <div class='popover-navigation'>
                      <button class='btn btn-default' data-role='next'>Next »</button>
                      <button class='btn btn-default' data-role='end'>Skip</button>
                    </div>
                    </div>`;
  
  public tour = new window['Tour']({template: this.template});
  
  initStepTour() {
    this.tour.addSteps([
                         {
                           element: "#welcome-connect-pos",
                           title: "Welcome to ConnectPOS!",
                           content: "Do you want to go through tutorial?",
                         },
                         {
                           element: "#setting-tutorial",
                           title: "Welcome to ConnectPOS!",
                           content: "Go to Settings section to start configuring your outlet",
                           backdrop: true,
                           onShown: () => {
                             jQuery(".btn[data-role=next]").css("display", "none");
                           },
                         },
                         {
                           element: "#new-outlet-tutorial",
                           title: "Welcome to ConnectPOS!",
                           content: "Click \"New Outlet\" button to create your first outlet",
                           backdrop: true,
                           onShown: () => {
                             jQuery(".btn[data-role=next]").css("display", "none");
                           },
                         },
                         {
                           element: "#form-add-new-outlet-tutorial",
                           title: "Welcome to ConnectPOS!",
                           content: "Fill all Outlet information, including outlet address on 2nd tab then click \"Create New\" button",
                           backdrop: true,
                           onShown: () => {
                             jQuery(".btn[data-role=next]").css("display", "none");
                             jQuery("#click-to-back-new-outlet-tutorial").css({"pointer-events": "none", "cursor": "default"});
                           },
                           onHide: () => {
                             jQuery('#outlet-information-tutorial').trigger('click');
                           },
                         },
                         {
                           element: "#add-new-register-tutorial",
                           title: "Welcome to ConnectPOS!",
                           content: "Click \"Add Register\" button to add register to Outlet",
                           backdrop: true,
                           onShown: () => {
                             jQuery(".btn[data-role=next]").css("display", "none");
                           },
                         },
                         {
                           element: "#form-add-new-register-tutorial",
                           title: "Welcome to ConnectPOS!",
                           content: "Fill all register information, note that first register should be enabled.",
                           backdrop: true,
                           onShown: () => {
                             jQuery(".btn[data-role=next]").css("display", "none");
                           },
                         },
                         {
                           element: "#back-to-pos-tutorial",
                           title: "Welcome to ConnectPOS!",
                           content: "Click \"Back\" button to go back to screen of register selection",
                           backdrop: true,
                           onShown: () => {
                             jQuery(".btn[data-role=next]").css("display", "none");
                           },
                         },
                         {
                           element: "#outlet-index",
                           title: "Welcome to ConnectPOS!",
                           content: "This is your new outlet. It is equal to your physical store.",
                           backdrop: true,
                         },
                         {
                           element: "#register-index",
                           title: "Welcome to ConnectPOS!",
                           content: "This is a register. An outlet can have one or many registers. Select this register to continue.",
                           backdrop: true,
                           onShown: () => {
                             jQuery(".btn[data-role=next]").css("display", "none");
                           },
                           onPause: () => {
                               jQuery(".popover").css("display", "none");
                             },
                         },
                         {
                           element: "#open-shift-tutorial",
                           title: "Welcome to ConnectPOS!",
                           content: "To start selling, open a new shift.",
                           backdrop: true,
                           onShown: () => {
                             jQuery(".btn[data-role=next]").css("display", "none");
                           }
                         },
                         {
                           element: "#button-open-shift-tutorial",
                           title: "Welcome to ConnectPOS!",
                           content: "Click this button to open a new shift",
                           backdrop: true,
                           onShown: () => {
                             jQuery(".btn[data-role=next]").css("display", "none");
                           }
                         },
                         {
                           element: "#done-open-shift-tutorial",
                           title: "Welcome to ConnectPOS!",
                           content: "Assume this is the amount you have in your till now. Click Done to continue",
                           backdrop: true,
                           onShown: () => {
                             jQuery(".btn[data-role=next]").css("display", "none");
                           }
                         },
                         {
                           element: "#hambuger-menu",
                           title: "Welcome to ConnectPOS!",
                           content: "Click here to go back to Sell screen",
                           backdrop: true,
                           onShown: () => {
                             jQuery(".btn[data-role=next]").css("display", "none");
                           }
                         },
                         {
                           element: "#search-product-tutorial",
                           title: "Welcome to ConnectPOS!",
                           content: "To find a particular product, type keywords in the search bar.",
                           backdrop: true
                         },
                         {
                           element: "#product-add-to-cart-tutorial",
                           title: "Welcome to ConnectPOS!",
                           content: "To add products to cart, you can also click on the product",
                           backdrop: true,
                           onShown: () => {
                             jQuery(".btn[data-role=next]").css("display", "none");
                           }
                         },
                         {
                           element: "#customer-icon-action-tutorial",
                           title: "Welcome to ConnectPOS!",
                           content: "Check out with guest customers, or click here to search and create a new one.",
                           backdrop: true
                         },
                         {
                           element: "#cart-value-tutorial",
                           title: "Welcome to ConnectPOS!",
                           content: "Click here to view the total value of the cart",
                           backdrop: true,
                           onShown: () => {
                             jQuery(".btn[data-role=next]").css("display", "none");
                           }
                         },
                         {
                           element: "#cart-value-for-see-tutorial",
                           title: "Welcome to ConnectPOS!",
                           content: "This is the total value of the cart",
                           backdrop: true
                         },
                         {
                           element: "#bottom-bar",
                           title: "Welcome to ConnectPOS!",
                           content: "Click \"Pay\" button to process to checkout step",
                           backdrop: true,
                           onShown: () => {
                             jQuery(".btn[data-role=next]").css("display", "none");
                           }
                         },
                         {
                           element: "#cash-payment-tutorial",
                           title: "Welcome to ConnectPOS!",
                           content: "You can choose one or many different payment methods for an order. For demo purpose, please select Cash method.",
                           backdrop: true,
                           onShown: () => {
                             jQuery(".btn[data-role=next]").css("display", "none");
                           }
                         },
                         {
                           element: "#complete-order-tutorial",
                           title: "Welcome to ConnectPOS!",
                           content: "Click \"Complete\" to finish checkout.",
                           backdrop: true,
                           onShown: () => {
                             jQuery(".btn[data-role=next]").css("display", "none");
                           }
                         },
                         {
                           element: "#new-order-tutorial",
                           title: "Welcome to ConnectPOS!",
                           content: "Click \"New Order\" to come back to Sell Screen and finish Tutorial.",
                           backdrop: true,
                           onShown: () => {
                             jQuery(".btn[data-role=next]").css("display", "none");
                           }
                         },
                         {
                           element: "#hambuger-menu",
                           title: "Welcome to ConnectPOS!",
                           content: "Click here and go to Order List to view the order you created.",
                           backdrop: true,
                           onShown: () => {
                             jQuery(".btn[data-role=next]").css("display", "none");
                           }
                         },
                       ]);
    this.tour.init();
    
    // Start the tour
    this.tour.start();
  }
}
