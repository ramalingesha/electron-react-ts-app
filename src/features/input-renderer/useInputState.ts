import { useState, useCallback } from 'react';

export function useInputState(initialValue = '') {
  const [value, setValue] = useState(initialValue);

  const handleChange = useCallback((e: any) => {
    setValue(e.target.value);
  }, []);

  return {
    value,
    onChange: handleChange
  };
}