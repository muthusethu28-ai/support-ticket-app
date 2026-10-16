import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

/**
 * Shared colored badge for ticket status and priority values.
 */
@Component({
  selector: 'app-status-chip',
  standalone: true,
  imports: [NgClass],
  template: `<span class="status-chip" [ngClass]="cssClass">{{ label }}</span>`,
})
export class StatusChipComponent {
  @Input({ required: true }) kind: 'status' | 'priority' = 'status';
  @Input({ required: true }) value = '';

  get cssClass(): string {
    return `${this.kind}-${this.value}`;
  }

  get label(): string {
    return this.value.replace('-', ' ');
  }
}
