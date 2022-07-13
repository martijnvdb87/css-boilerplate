import './colorpalette.css';
import template from './colorpalette.html?raw';
import Color from '@/models/Color';

import { useTemplate } from '@/composables';

export default class ColorPalette extends HTMLElement {
  static get observedAttributes() {
    return ['name', 'color', 'steps'];
  }

  protected connectedCallback(): void {
    this.render();
  }

  render(): void {
    const name = this.getAttribute('name') ?? '';
    const color = this.getAttribute('color') ?? 'gray';
    const steps = parseInt(this.getAttribute('steps') ?? '50');

    const swatches: string[] = [];

    Object.entries(Color.palette(color, steps)).forEach(([key, value]) => {
      swatches.push(`<color-swatch color="${value.hex()}" weight="${key}" name="${name}"></color-swatch>`);
    });

    this.innerHTML = useTemplate(template, {
      COLOR_NAME: name,
      CONTENT: swatches.join('')
    });
  }
}

customElements.define('color-palette', ColorPalette);