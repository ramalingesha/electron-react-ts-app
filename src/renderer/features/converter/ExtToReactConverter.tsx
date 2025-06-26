import React, { useRef, useState } from 'react';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { parseExtJSCode } from '../ext-parser/parser';
import { generateJSXCode } from '../ext-parser/generator';
import { ParsedComponent } from '../ext-parser/types';
import { Toast } from 'primereact/toast';
import './styles.css';

interface OutputBlock {
  extCode: string;
  jsxCode: string;
}

export default function ExtToReactConverter() {
  const [extCode, setExtCode] = useState<string>('');
  const [history, setHistory] = useState<OutputBlock[]>([]);
  const outputRef = useRef<HTMLDivElement>(null);
  const toastRef = useRef<Toast>(null);

  const handleConvert = () => {
    try {
      const parsed: ParsedComponent[] = parseExtJSCode(extCode);
      const jsx = parsed.map((c) => generateJSXCode(c)).join('\n\n');

      setHistory([...history, { extCode, jsxCode: jsx }]);
      setExtCode('');

      setTimeout(() => {
        outputRef.current?.scrollTo({
          top: outputRef.current.scrollHeight,
          behavior: 'smooth',
        });
      }, 100);
    } catch (err) {
      setHistory([...history, { extCode, jsxCode: '// Error parsing ExtJS code.' }]);
      setExtCode('');
    }
  };

  const handleCopy = async (jsxCode: string) => {
    try {
      await navigator.clipboard.writeText(jsxCode);
      toastRef.current?.show({
        severity: 'success',
        summary: 'Copied',
        detail: 'JSX code copied to clipboard',
        life: 2000
      });
    } catch {
      toastRef.current?.show({
        severity: 'error',
        summary: 'Copy failed',
        detail: 'Could not copy JSX code',
        life: 2000
      });
    }
  };

  return (
    <div className="converter-container">
      <h2>Ext JS to React Migrator</h2>
      <div className="chat-layout">
        <Toast ref={toastRef} position="bottom-right" />
        <div className="output-box" ref={outputRef}>
          {history.map((block, index) => (
            <div key={index} className="chat-block">
              <div className="chat-user">
                <pre className="ext-input">{block.extCode}</pre>
              </div>
              <div className="chat-response">
                <div className="copy-row">
                  <strong>Generated JSX:</strong>
                  <Button
                    icon="pi pi-copy"
                    className="p-button-sm p-button-text"
                    onClick={() => handleCopy(block.jsxCode)}
                  />
                </div>
                <pre className="jsx-output">{block.jsxCode}</pre>
              </div>
            </div>
          ))}
        </div>

        <div className="input-box">
          <InputTextarea
            value={extCode}
            onChange={(e) => setExtCode(e.target.value)}
            placeholder="Paste ExtJS code here..."
            rows={3}
            className="code-input"
            autoResize
          />
          <div className="button-row">
            <Button
              label="Generate JSX"
              icon="pi pi-code"
              onClick={handleConvert}
              className="p-button-sm"
              disabled={!extCode.trim()}
            />
          </div>
        </div>
      </div>
    </div>
  );
}