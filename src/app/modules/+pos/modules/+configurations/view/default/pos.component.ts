import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
             // moduleId: module.id,
             selector: 'configurations-default-pos',
             template: `
               <router-outlet></router-outlet>`,
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class ConfigurationsDefaultPosComponent {
}
