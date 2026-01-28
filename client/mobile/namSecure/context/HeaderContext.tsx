import React, { createContext, useContext, useState, ReactNode } from 'react';

interface HeaderContextType {
  showHeader: boolean;
  setShowHeader: (value: boolean) => void;
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export const HeaderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [showHeader, setShowHeader] = useState(true);

  return (
    <HeaderContext.Provider value={{ showHeader, setShowHeader }}>
      {children}
    </HeaderContext.Provider>
  );
};

export const useHeader = () => {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error('useHeader doit être utilisé dans un HeaderProvider');
  }
  return context;
};
