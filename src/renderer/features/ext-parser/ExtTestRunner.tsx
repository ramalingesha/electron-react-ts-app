import React, { useState } from 'react';
import { parseExtJSCode } from './parser';
import { ParsedComponent } from './types';
import { generateJSXCode } from './generator';

const extCodeSample = `
  new Ext.Panel({
    layout: 'border',
    items: [
      {
        region: 'center',
        xtype: 'tabpanel',
        items: [
          { xtype: 'grid', title: 'Grid 1' },
          { xtype: 'form', title: 'Form 1' }
        ]
      }
    ]
  });
`;

export default function ExtTestRunner() {
  const [parsed, setParsed] = useState<ParsedComponent[]>([]);
  const [output, setOutput] = useState<string>('');

  const handleParse = () => {
    const results = parseExtJSCode(extCodeSample);
    setParsed(results);
    const jsxStrings = results.map(generateJSXCode).join('\n\n');
    setOutput(jsxStrings);
  };

  return (
    <div>
      <h3>ExtJS Sample Test</h3>
      <button onClick={handleParse}>Parse + Convert</button>
      <pre style={{ background: '#eee', padding: '1em', marginTop: '1em' }}>
        {extCodeSample}
      </pre>

      <h4>Generated JSX Preview</h4>
      <pre style={{ background: '#f6f8fa', padding: '1em', whiteSpace: 'pre-wrap' }}>
        {output}
      </pre>
    </div>
  );
}