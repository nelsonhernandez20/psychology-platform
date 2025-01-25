// hooks/usePsychologists.ts
import { useState, useEffect } from 'react';
import { getPsychologists } from '@/lib/database';

type Psychologist = {
  id: string;
  name: string;
  specialization: string;
  pricePerHour: string;
  availability: string;
};

export const usePsychologists = () => {
  const [psychologists, setPsychologists] = useState<Psychologist[]>([]); // Lista de psicólogos
  const [loading, setLoading] = useState<boolean>(false); // Estado de carga
  const [error, setError] = useState<string | null>(null); // Estado de error

  useEffect(() => {
    const fetchPsychologists = async () => {
      try {
        setLoading(true);
        const data = await getPsychologists(); // Obtener psicólogos de Supabase
        setPsychologists(data);
      } catch (err: any) {
        setError('No se pudieron cargar los psicólogos. Intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchPsychologists();
  }, []); // Solo se ejecuta una vez al montar el componente

  return { psychologists, loading, error };
};
