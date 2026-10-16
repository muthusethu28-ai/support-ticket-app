import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  template: `<div class="d-flex justify-content-center py-4"><mat-spinner diameter="40" /></div>`,
})
export class LoaderComponent {}
