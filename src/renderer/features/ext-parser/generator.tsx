import { ReactComponentMapping } from "./types";

export function generateJSXCode(component: ReactComponentMapping): string {
  const { tag, props = {}, events = {}, label } = component;

  const propStr = Object.entries(props)
    .map(([key, value]) => {
      if (typeof value === 'string' && !value.startsWith('{')) {
        return `${key}="${value}"`;
      } else {
        return `${key}={${value}}`;
      }
    })
    .join(' ');

  const eventStr = Object.entries(events)
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