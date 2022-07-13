import './fullcolorpalette.css';
import template from './fullcolorpalette.html?raw';

import { useTemplate } from '@/composables';
import File from '@/models/File';
import Color from '@/models/Color';

interface ColorPalette {
  name: string,
  color: string
}

export default class FullColorPalette extends HTMLElement {
  private colors: ColorPalette[] = [];
  private steps: number = 50;

  static get observedAttributes() {
    return ['colors', 'steps'];
  }

  protected connectedCallback(): void {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render(): void {
    const colors = this.getAttribute('colors') ?? '';
    this.steps = parseInt(this.getAttribute('steps') ?? '50');

    this.colors = colors.split(';').map((part: string) => {
      part = part.replace(/(\r\n|\n|\r)/gm, '');
      part = part.trim();
      return part;

    }).filter((part: string) => {
      return !(part === '' || !part.includes(':'));

    }).map((part: string): ColorPalette => {
      let [name, color] = part.split(':');

      name = name.trim();
      color = color.trim();
      return {name, color};
    });
    
    this.innerHTML = useTemplate(template, {
      PALETTES: this.colors.map((color: ColorPalette) => {
        return `<color-palette name="${color.name}" color="${color.color}" steps="${this.steps}"></color-palette>`
      }).join('')
    });

    const buttons = this.querySelectorAll('.full-color-palette__export-button');

    Array.from(buttons, button => {
      button.addEventListener('click', () => this.export());
    });
  }

  private export(): void {
    const file = new File('colors.css');

    const output: string[] = [
      `:root,::before,::after{`
    ];

    for(const color of this.colors) {
      Object.entries(Color.palette(color.color, this.steps)).forEach(([key, value]) => {
        output.push(`--color-${color.name}-${key}:${value.hex()};`);

        const hue = Math.round(value.get('hsl.h'));
        const saturation = Math.round(value.get('hsl.s') * 100);
        const lightness = Math.round(value.get('hsl.l') * 100);

        output.push(`--hsl-${color.name}-${key}:${hue},${saturation}%,${lightness}%;`);
      });

    }

    output.push(`}`);
    file.content = output.join('');
    file.download();
  }
}