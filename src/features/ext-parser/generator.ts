import { ReactComponentMapping } from './componentMapper';

export function generateJSXCode(component: ReactComponentMapping): string {
  const { tag, props, events, label } = component;

  const propStr = Object.entries(props || {})
    .map(([key, value]) =>
      typeof value === 'string' && !value.startsWith('{')
        ? `${key}="${value}"`
        : `${key}={${value}}`
    )
    .join(' ');

  const eventStr = Object.entries(events || {})
    .map(([key, handler]) => `${key}={${handler}}`)
    .join(' ');

  const inputLine = `<${tag} ${propStr} ${eventStr} />`;

  if (label) {
    const id = props.id || props.name || 'field';
    return [
      `<div className="p-field">`,
      `  <label htmlFor="${id}">${label}</label>`,
      `  ${inputLine}`,
      `</div>`
    ].join('\n');
  }

  return inputLine;
}