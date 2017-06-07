import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';

@Component({
             // moduleId: module.id,
             encapsulation: ViewEncapsulation.None,
             selector: 'pos-default-theme',
             template: '<router-outlet></router-outlet>',
             styleUrls: ['default.scss', '../../../../../assets/css/pos.scss'],
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultTheme {
}
