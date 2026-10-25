export class Theme {
      primary = '#0a0d15';
      accentPrimary = '#e37d43';
      accentSecondary = '#e3b097'
      //#7e3a3d
      text = '#cecece'
      background = '#141b2c'

      constructor() {
            for (const k of Object.keys(this)) {
                  //@ts-expect-error
                  this[k] = localStorage.getItem(`theme/chat#${k}`) ?? this[k]
            }
      }

      public update() {
            for (const [k,v] of Object.entries(this)) {
                  localStorage.setItem(`theme/chat#${k}`, v)
            }
      }

      public colors(): (keyof this)[] {
            return [
                  'primary',
                  'accentPrimary', 
                  'accentSecondary',
                  'text',
                  'background',  
            ]
      }
}

export const row = (gap = '10px') => `display: flex; flex-direction: row; gap: ${gap};`
export const column = (gap = '10px', reverse: boolean = false) => `display: flex; flex-direction: ${reverse ? 'column-reverse' : 'column'}; gap: ${gap};`