import {Component, ViewEncapsulation} from '@angular/core';

@Component({
             // moduleId: module.id,
             encapsulation: ViewEncapsulation.None,
             selector: 'pos-default-theme',
             template: '<router-outlet></router-outlet>',
             styleUrls: ['default.scss']
           })
export class PosDefaultTheme {
}
