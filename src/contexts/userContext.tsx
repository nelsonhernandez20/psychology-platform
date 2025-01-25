"use client";
import { createContext, useState, useContext, ReactNode, useEffect, use } from 'react';

// Tipo de datos que vamos a manejar
type UserData = {
  id: string;
  email: string;
  role: 'user' | 'psychologist';
  psychologist?: {
    specialization: string;
    pricePerHour: string;
    availability: string;
  };
};

// Crear el contexto
const UserContext = createContext<{
  userData: UserData | null;
  setUserData: (userData: UserData) => void;
}>({
  userData: null,
  setUserData: () => {},
});

// Proveedor del contexto
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    console.log(userData, 'aaaa');
  }, [userData]);

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook para usar el contexto
export const useUser = () => useContext(UserContext);
