export class Outlet {
  static getAddress(outlet: Object) {
    return {
      'first_name': 'Outlet',
      'middlename': '',
      'last_name': 'Address',
      'company': '',
      'street': outlet['street'],
      'city': outlet['city'],
      'country_id': outlet['country_id'],
      'region_id': outlet['region_id'] ? outlet['region_id'] : "*",
      'region': '-',
      'postcode': outlet['postcode'],
      'telephone': outlet['telephone'],
    };
  }
}
