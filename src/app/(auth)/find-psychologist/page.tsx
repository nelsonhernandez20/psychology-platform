"use client";
import React, { useEffect, useState } from 'react';
import { useUser } from '@/contexts/userContext';
import { useRouter } from 'next/navigation';
import { useUserPsychologists } from '@/hooks/useUserList';

const FindPsychologist = () => {
  const { userData } = useUser(); // Obtener el rol del usuario
  const { userPsychologists, loading, error } = useUserPsychologists(); // Usar el hook
  const router = useRouter();
  interface Psychologist {
    id: number;
    full_name: string;
    // Add other properties if needed
    // Add other properties if needed
  }
  
  const [selectedPsychologist, setSelectedPsychologist] = useState<Psychologist | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Evitar que el código dependa de `userData` hasta que esté disponible en el cliente
  useEffect(() => {
    // if (userData?.role !== 'user') {
    //   // Si el usuario no es cliente, redirigir a otra pantalla
    //   router.push('/auth/dashboard');
    // }
  }, [userData, router]);

  // Función para enviar el correo con los datos
  const sendEmail = async (psychologistId: number, clientEmail: string) => {
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ psychologistId, clientEmail }),
      });

      const data = await response.json();
      if (data.success) {
        alert('Correo enviado con éxito');
      } else {
        alert('Hubo un problema al enviar el correo');
      }
    } catch (error) {
      console.error("Error al enviar el correo:", error);
      alert('Error al enviar el correo');
    }
  };

  const handleShowModal = (psychologist:any) => {
    setSelectedPsychologist(psychologist);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPsychologist(null);
  };

  const handleSendEmail = () => {
    const clientEmail = userData?.email || ''; // Asumir que userData tiene el email
    if (!selectedPsychologist || !clientEmail) {
      return;
    }
    sendEmail(selectedPsychologist.id, clientEmail);
    handleCloseModal();
  };

  const handleVideoCall = () => {
    router.push('/room')
  }

  return (
    <div>
      <h1 className='mb-2 text-black'>Encuentra un Psicólogo</h1>
      {loading && <p>Cargando psicólogos...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {userPsychologists.length > 0 ? (
        <ul>
          {userPsychologists.map((psychologist:any) => (
            <li className='cursor-pointer w-[20%] text-black' key={psychologist.id}>
              <h3> Nombre del psicólogo: {psychologist?.full_name ?? 'a'}</h3>
              <button
                onClick={() => handleShowModal(psychologist)}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Ver detalles
              </button>
            </li>
          ))}
        </ul>
      ) : (
        !loading && <p>No hay psicólogos disponibles.</p>
      )}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">Detalles del Psicólogo</h2>
            <p className="mb-4">Nombre: {selectedPsychologist?.full_name ?? 'N/A'}</p>
            <button
              onClick={handleSendEmail}
              className="bg-green-500 text-white px-4 py-2 rounded mr-2"
            >
              Enviar Correo
            </button>
            <button
              onClick={handleCloseModal}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Cerrar
            </button>

            <button
              onClick={handleVideoCall}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              ir a llamada
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindPsychologist;