import {Injectable} from '@angular/core';
import * as _ from "lodash";
import {TranslateService} from "@ngx-translate/core";
import {AppStorage} from "../../../services/storage";
import {GeneralException} from "../../../code/GeneralException";

@Injectable()
export class RetailTranslate {
  
  protected languageElementData: any;
  
  constructor(protected translate: TranslateService, protected storage: AppStorage) {
  }
  
  resolveLanguages() {
    if (_.size(this.translate.getLangs()) === 0) {
      this.translate.addLangs(this.getLanguagesCodeSupported());
     
      let usedLang = this.storage.localRetrieve('currentLanguage');
      if (usedLang) {
        this.translate.setDefaultLang(usedLang);
        this.translate.use(usedLang);
      } else {
        this.translate.setDefaultLang('en');
        this.translate.use('en');
      }
    }
  }
  
  protected getLanguagesSupported(): Object[] {
    return [
      {
        code: 'en',
        label: 'English',
        is_default: false
      },
      {
        code: 'vi',
        label: 'Tiếng Việt',
        is_default: true
      },
    ];
  }
  
  protected getLanguagesCodeSupported(): any {
    return _.reduce(this.getLanguagesSupported(), (result, value) => {
      result.push(value['code']);
      
      return result;
    }, []);
  }
  
  protected getDefaultLanguage() {
    if (_.isEmpty(this.getLanguagesSupported())) {
      throw new GeneralException("Please config language data");
    }
    let _default = _.find(this.getLanguagesSupported(), (language) => language['is_default'] === true);
    
    return _default ? _default : this.getLanguagesSupported()[0];
  }
  
  getListLanguageSupport() {
    if (typeof this.languageElementData === "undefined") {
      this.languageElementData = {data: []};
      _.forEach(this.getLanguagesSupported(), (optionType: Object) => {
        this.languageElementData.data.push({
                                             value: optionType['code'],
                                             label: optionType['label']
                                           });
      });
    }
    return this.languageElementData;
  }
  
  updateLanguage(lang: string) {
    this.storage.localStorage('currentLanguage', lang);
  }
  
  getCurrentLanguage() {
    return this.storage.localRetrieve('currentLanguage');
  }
}
