export class Theme {
      primary = '#161514';
      secondary = '#6E6A63';
      accentPrimary = '#c24a17';
      accentSecondary = '#f29a59'
      //#7e3a3d
      text = '#f7e2cf'
      background = '#21201E'

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

export const border = (color: string) => `border: 1px solid ${color}`
export const row = (gap = '10px') => `display: flex; flex-direction: row; gap: ${gap};`
export const column = (gap = '10px', reverse: boolean = false) => `display: flex; flex-direction: ${reverse ? 'column-reverse' : 'column'}; gap: ${gap};`