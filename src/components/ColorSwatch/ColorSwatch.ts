import './colorswatch.css';
import template from './colorswatch.html?raw';

import { useTemplate } from '@/composables';

export default class ColorSwatch extends HTMLElement {
  protected connectedCallback(): void {
    const name = this.getAttribute('name') ?? '';
    const color = this.getAttribute('color') ?? 'gray';
    const weight = this.getAttribute('weight') ?? '500';

    this.innerHTML = useTemplate(template, {
      COLOR_VAR: `--color-${name}-${weight}`,
      COLOR_HEX: color,
      COLOR_WEIGHT: weight,
    });
  }
}