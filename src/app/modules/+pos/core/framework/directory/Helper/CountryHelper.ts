import * as _ from 'lodash';

export class CountryHelper {
  private static _selectElement = {};
  private static _countries     = [];
  private static _data          = {};
  
  static set countries(value) {
    CountryHelper._selectElement = {};
    this._countries              = value;
  }
  
  static getCountries() {
    return CountryHelper._countries;
  }
  
  static getCountrySelect() {
    if (!CountryHelper._selectElement.hasOwnProperty('country')) {
      CountryHelper._selectElement['country'] = {
        data: []
      };
      
      _.forEach(CountryHelper.getCountries(), (country) => {
        CountryHelper._selectElement['country']['data']
          .push({
                  value: country.id,
                  label: country.name
                });
      });
    }
    return CountryHelper._selectElement['country'];
  }
  
  static getCountryNameFromId(country_id: string) {
    let arr = _.find(CountryHelper.getCountrySelect()['data'], (value) => {
      return parseInt(value['value'] + '') === parseInt(country_id + '');
    });
    return !!arr ? arr['label'] : country_id;
  }
  
  static getRegionSelect(countryId) {
    if (!CountryHelper._selectElement.hasOwnProperty('region')) {
      CountryHelper._selectElement['region'] = {};
    }
    
    if (!CountryHelper._selectElement['region'].hasOwnProperty(countryId)) {
      let _country = _.find(CountryHelper.getCountries(), (country) => country['id'] === countryId);
      if (_country && _.size(_country['regions']) > 0) {
        CountryHelper._selectElement['region'][countryId] = {
          data: []
        };
        _.forEach(_country['regions'], (region: any) => {
          CountryHelper._selectElement['region'][countryId]['data']
            .push({
                    value: region.region_id,
                    label: region.default_name
                  });
        });
      } else {
        CountryHelper._selectElement['region'][countryId] = false;
      }
    }
    return CountryHelper._selectElement['region'][countryId];
  }
  
  static getRegionSelected(countryId, regionId) {
    if (!CountryHelper._data.hasOwnProperty(countryId + "|" + regionId)) {
      let _region;
      let _country = _.find(CountryHelper.getCountries(), (country) => country['id'] === countryId);
      if (_country && _.size(_country['regions']) > 0) {
        _region = _.find(_country['regions'], (region) => region['region_id'] === regionId);
      }
      if (_region) {
        CountryHelper._data[countryId + "|" + regionId] = _region['default_name'];
      } else {
        CountryHelper._data[countryId + "|" + regionId] = regionId;
      }
    }
    return CountryHelper._data[countryId + "|" + regionId];
  }
}
