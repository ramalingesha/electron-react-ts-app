import { parse } from 'acorn';
import { simple as walk } from 'acorn-walk';
import { ParsedComponent } from './types';

export function parseExtJSCode(code: string): ParsedComponent[] {
  const ast = parse(code, { ecmaVersion: 2020 }) as any;
  const results: ParsedComponent[] = [];

  walk(ast, {
    NewExpression(node: any) {
      if (
        node.callee.type === 'MemberExpression' &&
        node.callee.object.name === 'Ext'
      ) {
        const xtype = node.callee.property.name.toLowerCase();
        const configNode = node.arguments[0];

        if (configNode?.type === 'ObjectExpression') {
          const parsed = parseConfigObject(configNode);
          results.push({ xtype, config: parsed });
        }
      }
    }
  });

  return results;
}

function parseConfigObject(objNode: any): any {
  const result: any = {};

  objNode.properties.forEach((prop: any) => {
    const key = prop.key.name || prop.key.value;

    if (prop.value.type === 'Literal') {
      result[key] = prop.value.value;
    } else if (prop.value.type === 'ObjectExpression') {
      result[key] = parseConfigObject(prop.value);
    } else if (prop.value.type === 'ArrayExpression') {
      result[key] = prop.value.elements.map((el: any) =>
        el.type === 'ObjectExpression' ? parseConfigObject(el) : el.value
      );
    } else if (prop.value.type === 'Identifier') {
      result[key] = prop.value.name; // could later link to variable context
    }
  });

  return result;
}