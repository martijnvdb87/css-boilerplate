import './full-color-palette.css';
import template from './full-color-palette.html?raw';

import { useTemplate } from '@/composables';
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
  }

  export(): string {
    const output: string[] = [
      `:root,::before,::after{`
    ];
    
    output.push(`--white:#ffffff;`);

    const grayColor = this.colors.find(color => color.name === 'gray');

    if(grayColor) {
      const grayColorPalette = Color.palette(grayColor.color, this.steps);
      output.push(`--black:${grayColorPalette[900].hex()};`);
    }

    for(const color of this.colors) {
      const totalSteps = 900 / this.steps;
      const middleStep = Math.round(totalSteps / 2);
      const colorDefaultWeight = middleStep * this.steps;
      const defaultColor = Color.palette(color.color, this.steps)[colorDefaultWeight];

      output.push(`--${color.name}:${defaultColor};`);
    }

    for(const color of this.colors) {
      Object.entries(Color.palette(color.color, this.steps)).forEach(([key, value]) => {
        output.push(`--${color.name}-${key}:${value.hex()};`);
      });
    }
    
    output.push(`--white:0,0%,100%;`);

    if(grayColor) {
      const grayColorPalette = Color.palette(grayColor.color, this.steps);
      const hslH = Math.round(grayColorPalette[900].get('hsl.h'));
      const hslS = Math.round(grayColorPalette[900].get('hsl.s') * 100);
      const hslL = Math.round(grayColorPalette[900].get('hsl.l') * 100);

      output.push(`--hsl-black:${hslH},${hslS}%,${hslL}%;`);
    }

    for(const color of this.colors) {
      Object.entries(Color.palette(color.color, this.steps)).forEach(([key, value]) => {
        const hslH = Math.round(value.get('hsl.h'));
        const hslS = Math.round(value.get('hsl.s') * 100);
        const hslL = Math.round(value.get('hsl.l') * 100);

        output.push(`--hsl-${color.name}-${key}:${hslH},${hslS}%,${hslL}%;`);
      });
    }

    output.push(`}`);

    return output.join('');
  }
}

customElements.define('full-color-palette', FullColorPalette);