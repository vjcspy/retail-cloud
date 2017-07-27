import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RetailTranslate} from "../../../../../../services/retail-translate";

@Component({
             // moduleId: module.id,
             selector: 'configurations-default-translate',
             templateUrl: 'translate.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })

export class ConfigurationsDefaultTranslateComponent {
  public currentLanguage;
  
  constructor(protected retailTranslate: RetailTranslate) { }
  
  public getLanguagesElemData() {
    return this.retailTranslate.getListLanguageSupport();
  }
  
  updateLanguage(event) {
    console.log(event);
    this.retailTranslate.updateLanguage(event);
  }
}
