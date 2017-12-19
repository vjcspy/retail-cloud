import {NgModule} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {AngularMeteorComponent} from "./components/index";

@NgModule({
            imports: [CommonModule,
                      FormsModule],
            exports: [...AngularMeteorComponent],
            declarations: [...AngularMeteorComponent],
            providers: [],
          })
export class AngularMeteorModule {
}
