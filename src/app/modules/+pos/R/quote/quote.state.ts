export interface QuoteState {
  customer?: Object;
  shippingAdd?: Object;
  billingAdd?: Object;
  items: any[];
  hasShipment?: boolean;
}
