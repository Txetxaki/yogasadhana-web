import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  imports: [RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`,
  styles: [`:host { display: block; }`],
})
export class App {}
