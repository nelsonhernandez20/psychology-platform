"use client";
import React, { useEffect } from 'react';
import { useUser } from '@/contexts/userContext';
import { useRouter } from 'next/navigation';
import { usePsychologists } from '@/hooks/usePsychologists';
import { useUserPsychologists } from '@/hooks/useUserList';

const FindPsychologist = () => {
  const { userData } = useUser(); // Obtener el rol del usuario
  const { userPsychologists, loading, error } = useUserPsychologists(); // Usar el hook

  const router = useRouter();

  // Evitar que el código dependa de `userData` hasta que esté disponible en el cliente
  useEffect(() => {
    if (userData?.role !== 'user') {
      // Si el usuario no es cliente, redirigir a otra pantalla
      router.push('/auth/dashboard');
    }
  }, [userData, router]);

  return (
    <div>
      <h1 className='mb-2 text-black'>Encuentra un Psicólogo</h1>
      {loading && <p>Cargando psicólogos...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {userPsychologists.length > 0 ? (
        <ul>
          {userPsychologists.map((psychologist) => (
            <li className='cursor-pointer  w-[20%] text-black' key={psychologist.id}>
              <h3> Nombre del psicologo {psychologist.full_name}</h3>
              <button>Ver detalles</button>
            </li>
          ))}
        </ul>
      ) : (
        !loading && <p>No hay psicólogos disponibles.</p>
      )}
    </div>
  );
};

export default FindPsychologist;