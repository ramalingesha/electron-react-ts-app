import { mapExtInputComponent } from '../componentMapper';
import { generateJSXCode } from '../generator';

// Helper to fully run mapping and codegen
const run = (ext: any): string => {
  const mapped = mapExtInputComponent(ext);
  return mapped ? generateJSXCode(mapped) : '// Unsupported xtype or invalid input';
};

describe('ExtJS to React JSX Generator - Full Output + Edge Case Tests', () => {
  it('should handle complete textfield with events', () => {
    const input = {
      xtype: 'textfield',
      name: 'email',
      fieldLabel: 'Email',
      emptyText: 'Enter email',
      value: 'test@example.com',
      id: 'emailId',
      listeners: {
        change: 'onEmailChange',
        blur: 'onEmailBlur'
      }
    };

    const expected = `<div className="p-field">
  <label htmlFor="emailId">Email</label>
  <InputText name="email" placeholder="Enter email" value="test@example.com" id="emailId" onChange={onEmailChange} onBlur={onEmailBlur} />
</div>`;

    expect(run(input)).toBe(expected);
  });

  it('should map focus listener to onFocus', () => {
    const input = {
      xtype: 'textfield',
      name: 'inputFocus',
      fieldLabel: 'Input',
      listeners: {
        focus: 'onInputFocus'
      }
    };

    const expected = `<div className="p-field">
  <label htmlFor="inputFocus">Input</label>
  <InputText name="inputFocus" id="inputFocus" onFocus={onInputFocus} />
</div>`;

    expect(run(input)).toBe(expected);
  });

  it('should handle textarea with minimal props', () => {
    const input = {
      xtype: 'textarea',
      name: 'bio',
      fieldLabel: 'Bio',
      emptyText: 'Enter bio'
    };

    const expected = `<div className="p-field">
  <label htmlFor="bio">Bio</label>
  <InputTextarea name="bio" placeholder="Enter bio" id="bio" />
</div>`;

    expect(run(input)).toBe(expected);
  });

  it('should omit label if fieldLabel is missing', () => {
    const input = {
      xtype: 'textfield',
      name: 'nick',
      emptyText: 'Enter nickname'
    };

    const expected = `<InputText name="nick" placeholder="Enter nickname" id="nick" />`;

    expect(run(input)).toBe(expected);
  });

  it('should fallback to name for id if id is not given', () => {
    const input = {
      xtype: 'numberfield',
      name: 'age',
      fieldLabel: 'Age',
      value: 30
    };

    const expected = `<div className="p-field">
  <label htmlFor="age">Age</label>
  <InputNumber name="age" value={30} id="age" />
</div>`;

    expect(run(input)).toBe(expected);
  });

  it('should support Calendar component for datefield', () => {
    const input = {
      xtype: 'datefield',
      name: 'dob',
      fieldLabel: 'Date of Birth'
    };

    const expected = `<div className="p-field">
  <label htmlFor="dob">Date of Birth</label>
  <Calendar name="dob" id="dob" />
</div>`;

    expect(run(input)).toBe(expected);
  });

  it('should support Dropdown for combobox', () => {
    const input = {
      xtype: 'combobox',
      name: 'country',
      fieldLabel: 'Country',
      emptyText: 'Select Country'
    };

    const expected = `<div className="p-field">
  <label htmlFor="country">Country</label>
  <Dropdown name="country" placeholder="Select Country" id="country" options="[]" />
</div>`;

    expect(run(input)).toBe(expected);
  });

  it('should reject unknown xtype', () => {
    const input = {
      xtype: 'sliderfield',
      name: 'volume'
    };

    expect(run(input)).toBe('// Unsupported xtype or invalid input');
  });

  it('should reject null or undefined input', () => {
    expect(run(null)).toBe('// Unsupported xtype or invalid input');
    expect(run(undefined)).toBe('// Unsupported xtype or invalid input');
  });

  it('should reject missing xtype', () => {
    expect(run({ name: 'noxtype' })).toBe('// Unsupported xtype or invalid input');
  });

  it('should handle listeners without label', () => {
    const input = {
      xtype: 'textfield',
      name: 'code',
      listeners: {
        change: 'onChange'
      }
    };

    const expected = `<InputText name="code" id="code" onChange={onChange} />`;
    expect(run(input)).toBe(expected);
  });

  // Snapshot for a full config
  it('should match snapshot for full input', () => {
    const input = {
      xtype: 'textfield',
      name: 'username',
      fieldLabel: 'Username',
      emptyText: 'Enter username',
      listeners: {
        change: 'onUsernameChange'
      }
    };

    const jsx = run(input);
    expect(jsx).toMatchSnapshot();
  });

  describe('Event mapping for listeners', () => {
    const testEvents = [
      { ext: 'change', react: 'onChange', handler: 'handleChange' },
      { ext: 'focus', react: 'onFocus', handler: 'handleFocus' },
      { ext: 'blur', react: 'onBlur', handler: 'handleBlur' },
      { ext: 'select', react: 'onSelect', handler: 'handleSelect' },
      { ext: 'click', react: 'onClick', handler: 'handleClick' },
      { ext: 'keyup', react: 'onKeyUp', handler: 'handleKeyUp' },
      { ext: 'keydown', react: 'onKeyDown', handler: 'handleKeyDown' }
    ];

    testEvents.forEach(({ ext, react, handler }) => {
      it(`should map '${ext}' event to '${react}'`, () => {
        const input = {
          xtype: 'textfield',
          name: `input-${ext}`,
          fieldLabel: `Label ${ext}`,
          listeners: { [ext]: handler }
        };

        const output = run(input);
        expect(output).toContain(`${react}={${handler}}`);
      });
    });

    it('should ignore unknown events gracefully', () => {
      const input = {
        xtype: 'textfield',
        name: 'code',
        fieldLabel: 'Code',
        listeners: {
          focus: 'onFocusHandler',
          invalidEvent: 'noopHandler'
        }
      };

      const output = run(input);
      expect(output).toContain('onFocus={onFocusHandler}');
      expect(output).not.toContain('noopHandler');
    });
  });

  it('should handle missing props gracefully', () => {
    const result = generateJSXCode({
      tag: 'InputText',
      props: undefined,
      events: {},
      label: undefined
    });

    expect(result).toBe('<InputText id="field" />');
  });

  it('should handle missing events gracefully', () => {
    const result = generateJSXCode({
      tag: 'InputText',
      props: { name: 'email', id: 'email' },
      events: undefined,
      label: undefined
    });

    expect(result).toBe('<InputText name="email" id="email" />');
  });

  it('should fallback to default id "field" if id and name are missing', () => {
    const result = generateJSXCode({
      tag: 'InputText',
      props: {},
      events: {},
      label: 'Default Field'
    });

    expect(result).toBe(`<div className="p-field">
  <label htmlFor="field">Default Field</label>
  <InputText id="field" />
</div>`);
  });
});
