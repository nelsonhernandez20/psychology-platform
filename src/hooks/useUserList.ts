// hooks/usePsychologists.ts
import { useState, useEffect } from 'react';
import { getPsychologists,getUsersWithRolePsychologist } from '@/lib/database';

type Psychologist = {
  id: string;
  name: string;
  specialization: string;
  pricePerHour: string;
  availability: string;
};

export const useUserPsychologists = () => {
  const [userPsychologists, setUsersListPsychologists] = useState<Psychologist[]>([]); // Lista de psicólogos
  const [loading, setLoading] = useState<boolean>(false); // Estado de carga
  const [error, setError] = useState<string | null>(null); // Estado de error

  useEffect(() => {
    const fetchUserPsychologists = async () => {
      try {
        setLoading(true);
        const data = await getUsersWithRolePsychologist(); // Obtener psicólogos de Supabase
        setUsersListPsychologists(data);
      } catch (err: any) {
        setError('No se pudieron cargar los psicólogos. Intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserPsychologists();
  }, []); // Solo se ejecuta una vez al montar el componente

  return { userPsychologists, loading, error };
};
