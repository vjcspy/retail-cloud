import {NgModule} from "@angular/core";
import {HttpModule} from "@angular/http";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {MomentModule} from "angular2-moment";

@NgModule({
            imports: [
              CommonModule,
              FormsModule,
              HttpModule,
              MomentModule
            ],
            exports: [
              CommonModule,
              FormsModule,
              HttpModule,
              MomentModule
            ],
            declarations: [],
            providers: [],
          })
export class ShareModule {
}
