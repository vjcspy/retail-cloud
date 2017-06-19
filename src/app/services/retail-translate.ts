import {Injectable} from '@angular/core';
import * as _ from "lodash";
import {DatabaseManager} from "./database-manager";
import {GeneralException} from "../modules/+pos/core/framework/General/Exception/GeneralException";
import {GeneralMessage} from "../modules/+pos/services/general/message";
import {TranslateService} from "@ngx-translate/core";

@Injectable()
export class RetailTranslate {
  
  protected languageElementData: any;
  
  constructor(protected translate: TranslateService, protected db: DatabaseManager) {
  }
  
  resolveLanguages() {
    if (_.size(this.translate.getLangs()) === 0) {
      this.translate.addLangs(this.getLanguagesCodeSupported());
      this.translate.setDefaultLang('en');
      this.translate.use('vi');
      
      this.db.getDbInstance().retailConfig.where('key').equals('currentLanguage')
          .first()
          .then((data: any) => {
            if (!!data['value']) {
              this.translate.use(data['value']);
            }
          });
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
    if (typeof this.languageElementData == "undefined") {
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
  
  updateLanguage(lang: string): Promise<GeneralMessage> {
    console.log(lang);
    this.translate.use(lang);
    return new Promise((resolve, reject) => {
      this.db.getDbInstance().retailConfig
          .put(<any>{key: 'currentLanguage', value: lang})
          .then(() => resolve())
          .catch((e) => reject({isError: true, e}));
    });
  }
  
}
