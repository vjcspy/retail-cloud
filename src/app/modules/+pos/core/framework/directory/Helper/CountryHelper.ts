import * as _ from 'lodash';

export class CountryHelper {
  private static _selectElement = {};
  private static _countries     = [];
  private static _data          = {};
  
  static set countries(value) {
    CountryHelper._selectElement = {};
    this._countries              = value;
  }
  
  getCountries() {
    return CountryHelper._countries;
  }
  
  getCountrySelect() {
    if (!CountryHelper._selectElement.hasOwnProperty('country')) {
      CountryHelper._selectElement['country'] = {
        data: []
      };
      
      _.forEach(this.getCountries(), (country) => {
        CountryHelper._selectElement['country']['data']
          .push({
                  value: country.id,
                  label: country.name
                });
      });
    }
    return CountryHelper._selectElement['country'];
  }
  
  getCountryNameFromId(country_id: string) {
    let arr = _.find(this.getCountrySelect()['data'], (value) => {
      return parseInt(value['value'] + '') === parseInt(country_id + '');
    });
    return !!arr ? arr['label'] : country_id;
  }
  
  getRegionSelect(countryId) {
    if (!CountryHelper._selectElement.hasOwnProperty('region')) {
      CountryHelper._selectElement['region'] = {};
    }
    
    if (!CountryHelper._selectElement['region'].hasOwnProperty(countryId)) {
      let _country = _.find(this.getCountries(), (country) => country['id'] === countryId);
      if (_country && _.size(_country['regions']) > 0) {
        CountryHelper._selectElement['region'][countryId] = {
          data: []
        };
        _.forEach(_country['regions'], (region) => {
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
  
  getRegionSelected(countryId, regionId) {
    if (!CountryHelper._data.hasOwnProperty(countryId + "|" + regionId)) {
      let _region  = {};
      let _country = _.find(this.getCountries(), (country) => country['id'] === countryId);
      if (_country && _.size(_country['regions']) > 0) {
        _region = _.find(_country['regions'], (region) => region['region_id'] === regionId);
      }
      CountryHelper._data[countryId + "|" + regionId] = _region['default_name'];
    }
    return CountryHelper._data[countryId + "|" + regionId];
  }
}
