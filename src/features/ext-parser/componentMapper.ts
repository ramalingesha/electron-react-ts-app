export interface ExtComponent {
  xtype: string;
  name?: string;
  fieldLabel?: string;
  emptyText?: string;
  value?: string;
  listeners?: Record<string, string>;
  [key: string]: any;
}

export interface ReactComponentMapping {
  tag: string;
  props: Record<string, string | number | boolean>;
  events: Record<string, string>;
  label?: string;
}

export function mapExtInputComponent(ext: ExtComponent): ReactComponentMapping | null {
  const { xtype, name, fieldLabel, emptyText, value, listeners = {} } = ext;

  const commonProps: Record<string, any> = {
    ...(name && { name }),
    ...(emptyText && { placeholder: emptyText }),
    ...(value && { value }),
    ...(ext.id && { id: ext.id || name }),
  };

  const eventMap: Record<string, string> = {};
  Object.entries(listeners).forEach(([event, handler]) => {
    if (event === 'change') eventMap['onChange'] = handler;
    else if (event === 'focus') eventMap['onFocus'] = handler;
    else if (event === 'blur') eventMap['onBlur'] = handler;
  });

  switch (xtype) {
    case 'textfield':
    case 'textfieldex':
      return {
        tag: 'InputText',
        props: commonProps,
        events: eventMap,
        label: fieldLabel,
      };

    case 'textarea':
    case 'textareafield':
      return {
        tag: 'InputTextarea',
        props: commonProps,
        events: eventMap,
        label: fieldLabel,
      };

    case 'numberfield':
      return {
        tag: 'InputNumber',
        props: commonProps,
        events: eventMap,
        label: fieldLabel,
      };

    case 'datefield':
      return {
        tag: 'Calendar',
        props: commonProps,
        events: eventMap,
        label: fieldLabel,
      };

    case 'combobox':
      return {
        tag: 'Dropdown',
        props: {
          ...commonProps,
          options: '[]',
        },
        events: eventMap,
        label: fieldLabel,
      };

    default:
      return null;
  }
}