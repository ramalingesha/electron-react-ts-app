import { parse } from 'acorn';
import { simple as walk } from 'acorn-walk';
import { ExtComponent } from './types';

export function parseExtJS(code: string): ExtComponent[] {
  const ast = parse(code, { ecmaVersion: 2020 });
  const components: ExtComponent[] = [];

  walk(ast, {
    NewExpression(node: any) {
      if (node.callee?.object?.name === 'Ext') {
        const xtype = node.callee.property.name;
        const configArg = node.arguments[0];
        if (configArg?.type === 'ObjectExpression') {
          const config: Record<string, any> = {};
          configArg.properties.forEach((prop: any) => {
            config[prop.key.name || prop.key.value] = prop.value.value || prop.value.name;
          });
          components.push({ xtype, config });
        }
      }
    }
  });

  return components;
}