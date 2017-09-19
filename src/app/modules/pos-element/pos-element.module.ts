import {NgModule} from '@angular/core';
import {RetailSelectComponent} from "./components/select.component";
import {RetailTextComponent} from "./components/text.component";
import {RetailSettingCheckboxComponent} from "./components/setting-checkbox.component";
import {RetailSettingRadioComponent} from "./components/setting-radio.component";
import {RetailSelect2Component} from "./components/select2.component";
import {ShareModule} from "../share/share.module";
import {RetailDateSelectComponent} from "./components/date.component";
import {RetailTimeSelectComponent} from "./components/time.component";

@NgModule({
            imports: [
              ShareModule
            ],
            exports: [
              RetailSelectComponent,
              RetailTextComponent,
              RetailSettingCheckboxComponent,
              RetailSettingRadioComponent,
              RetailSelect2Component,
              RetailDateSelectComponent,
              RetailTimeSelectComponent
            ],
            declarations: [
              RetailSelectComponent,
              RetailTextComponent,
              RetailSettingCheckboxComponent,
              RetailSettingRadioComponent,
              RetailSelect2Component,
              RetailDateSelectComponent,
              RetailTimeSelectComponent
            ],
          })
export class PosElementModule {
}
