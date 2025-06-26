import React from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { useInputState } from './useInputState';
import { MappedInputProps } from './types';

const componentMap: Record<string, React.ElementType> = {
  InputText,
  InputTextarea,
  InputNumber,
  Calendar,
  Dropdown
};

export const MappedInputField: React.FC<MappedInputProps> = React.memo(
  ({ tag, props, events, label }) => {
    const Component = componentMap[tag];
    const inputState = useInputState(props.value || '');

    if (!Component) return null;

    const allProps = {
      ...props,
      ...events,
      ...inputState
    };

    return (
      <div className="p-field">
        {label && (
          <label htmlFor={props.id || props.name} className="p-d-block mb-2">
            {label}
          </label>
        )}
        <Component {...allProps} />
      </div>
    );
  }
);