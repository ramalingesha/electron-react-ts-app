import { ExtComponent } from './types';
import { componentMap } from './mappings';

export function generateJSX(component: ExtComponent): string {
  const name = componentMap[component.xtype] || component.xtype;
  const props = Object.entries(component.config || {}).map(([k, v]) => `${k}="${v}"`).join(' ');
  return `<${name} ${props} />`;
}