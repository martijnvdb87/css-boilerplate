import './color-swatch.css';
import template from './color-swatch.html?raw';

import { useTemplate } from '@/composables';

export default class ColorSwatch extends HTMLElement {
  static get observedAttributes() {
    return ['name', 'color', 'weight'];
  }

  protected connectedCallback(): void {
    this.render();
  }

  render(): void {
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

customElements.define('color-swatch', ColorSwatch);