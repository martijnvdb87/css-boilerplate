import chroma from 'chroma-js';
import { ColorPalette } from '@/interfaces';

export default class Color {
  static palette(color: string, step: number = 50): ColorPalette {
    const palette: ColorPalette = {};

    step = Math.min(1000, Math.max(1, step));
  
    for(let weight: number = step; weight <= 900; weight += step) {
      const lightness: number = 1 - (weight / 1000);
      palette[weight] = chroma(color).set('hsl.l', lightness);
    }
  
    return palette;
  }
}
