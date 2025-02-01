"use client";
import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import Cookies from "js-cookie";

// Tipo de datos que vamos a manejar
type UserData = {
  id: string;
  email: string;
  role: "user" | "psychologist";
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
  const [userData, setUserData] = useState<UserData | null>(() => {
    // Recuperar datos de las cookies al inicializar el estado
    const storedUserData = Cookies.get("userData");
    return storedUserData ? JSON.parse(storedUserData) : null;
  });

  useEffect(() => {
    // Almacenar datos en las cookies cuando userData cambie
    if (userData !== null) {
      console.log('entro en if', userData);
      Cookies.set("userData", JSON.stringify(userData), { expires: 7 }); // La cookie expira en 7 días
    } else {
      console.log('entro en else', userData);
      Cookies.remove("userData");
    }
  }, [userData]);

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook para usar el contexto
export const useUser = () => useContext(UserContext);