import {NgModule} from '@angular/core';
import {WeekPickerComponent} from "./week-picker.component";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";

@NgModule({
            imports: [FormsModule, CommonModule],
            exports: [WeekPickerComponent],
            declarations: [WeekPickerComponent],
            providers: [],
          })
export class ElementModule {
}
