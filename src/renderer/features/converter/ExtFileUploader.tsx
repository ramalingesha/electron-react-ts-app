import React, { useRef } from 'react';
import { Button } from 'primereact/button';

interface ExtFileUploaderProps {
  onFileConverted: (extCode: string, convertedJSX: string) => void;
}

export const ExtFileUploader: React.FC<ExtFileUploaderProps> = ({ onFileConverted }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleIconClick = () => fileInputRef.current?.click();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !file.name.endsWith('.js')) return;

    const reader = new FileReader();
    reader.onload = () => {
      const fileContent = reader.result as string;

      try {
        const jsx = convertExtFileToReactJSX(fileContent);
        onFileConverted(fileContent, jsx);
      } catch (err) {
        onFileConverted(fileContent, '// Error during conversion.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <>
      <input
        type="file"
        accept=".js"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <Button
        icon="pi pi-upload"
        className="p-button-text p-button-rounded upload-button"
        onClick={handleIconClick}
        tooltip="Upload ExtJS file"
        tooltipOptions={{ position: 'top' }}
      />
    </>
  );
};

// Stub: Replace with real logic from extended converter
function convertExtFileToReactJSX(code: string): string {
  return `// JSX for uploaded file\n\n${code}`;
}