import { createContext, useContext, useState } from 'react';

const RegisterContext = createContext(null);
const STORAGE_KEY = 'fsdams_register_draft';

const emptyForm = {
  fullName: '',
  phone: '',
  gender: '',
  state: '',
  lga: '',
  ward: '',
  village: '',
};

// Each <RegisterProvider> in App.jsx is a separate React instance (one per step's route),
// so plain useState would reset between steps. We persist to sessionStorage instead —
// cleared automatically when the browser tab closes, and cleared manually after successful registration.
export function RegisterProvider({ children }) {
  const [form, setForm] = useState(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      return stored ? { ...emptyForm, ...JSON.parse(stored) } : emptyForm;
    } catch {
      return emptyForm;
    }
  });

  const updateForm = (fields) => {
    setForm((prev) => {
      const next = { ...prev, ...fields };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const clearForm = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setForm(emptyForm);
  };

  return (
    <RegisterContext.Provider value={{ form, updateForm, clearForm }}>
      {children}
    </RegisterContext.Provider>
  );
}

export const useRegisterForm = () => useContext(RegisterContext);
