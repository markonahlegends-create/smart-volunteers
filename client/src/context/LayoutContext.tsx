import { createContext, useContext, useState, type ReactNode } from 'react';

interface LayoutContextValue {
  laporanModalOpen: boolean;
  setLaporanModalOpen: (open: boolean) => void;
}

const LayoutContext = createContext<LayoutContextValue | undefined>(undefined);

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [laporanModalOpen, setLaporanModalOpen] = useState(false);

  return (
    <LayoutContext.Provider value={{ laporanModalOpen, setLaporanModalOpen }}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within LayoutProvider');
  }
  return context;
}
