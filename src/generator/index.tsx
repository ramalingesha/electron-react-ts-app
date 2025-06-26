import React, { useState } from 'react';
import { parseExtJS } from './parser';
import { generateJSX } from './generator';
import './styles.css';

const GeneratorApp = () => {
  const [files, setFiles] = useState([]);
  const [output, setOutput] = useState<string>('');
  const [tree, setTree] = useState<any[]>([]);

  const handleBrowse = async () => {
    // @ts-ignore
    const fileResults = await window.electronAPI.browseFiles();
    setFiles(fileResults);
    const jsxOutput = fileResults.map((file: any) => {
      const components = parseExtJS(file.content);
      setTree(components);
      return components.map(generateJSX).join('\n');
    }).join('\n');
    setOutput(jsxOutput);
  };

  const handleExport = async () => {
    // @ts-ignore
    const saved = await window.electronAPI.saveFile(output);
    alert(`Saved to ${saved}`);
  };

  const renderTree = (components: any[]) => (
    <ul className="pl-4">
      {components.map((c, i) => (
        <li key={i}>
          <span className="text-blue-700 font-bold">{c.xtype}</span>
          {c.children && renderTree(c.children)}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="container">
      <div className="button-row">
        <button onClick={handleBrowse} className="button-blue">Browse Files</button>
        <button onClick={handleExport} className="button-green">Export to JSX</button>
      </div>
      <div className="layout">
        <div>
          <h3 className="section-title">Component Tree</h3>
          {renderTree(tree)}
        </div>
        <div>
          <h3 className="section-title">Generated JSX</h3>
          <pre className="pre-box">{output}</pre>
        </div>
      </div>
    </div>
  );
}

export default GeneratorApp;