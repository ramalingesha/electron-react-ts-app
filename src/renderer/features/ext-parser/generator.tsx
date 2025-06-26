import { ParsedComponent } from './types';
import { componentMap } from './mappings';

export function generateJSXCode(component: ParsedComponent, level: number = 0): string {
  const indent = '  '.repeat(level);
  const tag = formatComponentName(component.xtype);
  const props = buildProps(component.config);

  const propStr = props ? ' ' + props : '';

  const children = component.config.items || [];
  if (children.length === 0) {
    return `${indent}<${tag}${propStr} />`;
  }

  const childJSX = children
    .map((child) =>
      generateJSXCode({
        xtype: child.xtype || 'panel',
        config: child,
      }, level + 1)
    )
    .join('\n');

  return `${indent}<${tag}${propStr}>\n${childJSX}\n${indent}</${tag}>`;
}

function formatComponentName(xtype?: string): string {
  if (!xtype) return 'div';
  const key = xtype.toLowerCase();
  return componentMap[key]?.name || 'div';
}

function buildProps(config: Record<string, any>): string {
  return Object.entries(config)
    .filter(([key]) => key !== 'items' && key !== 'xtype')
    .map(([key, value]) => {
      if (typeof value === 'string') return `${key}="${value}"`;
      return `${key}={${JSON.stringify(value)}}`;
    })
    .join(' ');
}