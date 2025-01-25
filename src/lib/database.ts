import { supabase } from "./supabaseClient";

// Obtener todos los psicólogos
export const getPsychologists = async () => {
  const { data, error } = await supabase.from("psychologists").select("*");
  if (error) throw new Error(error.message);
  return data;
};

// Obtener todos los usuarios con rol de psicólogo
export const getUsersWithRolePsychologist = async () => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("role", "psychologist");
  if (error) throw new Error(error.message);
  return data;
};

// Agregar una cita
export const addAppointment = async (
  userId: string,
  psychologistId: string,
  date: string
) => {
  const { data, error } = await supabase.from("appointments").insert([
    {
      user_id: userId,
      psychologist_id: psychologistId,
      appointment_date: date,
    },
  ]);
  if (error) throw new Error(error.message);
  return data;
};

// Obtener todas las citas de un usuario
export const getAppointmentsByUser = async (userId: string) => {
  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .eq("user_id", userId);
  if (error) throw new Error(error.message);
  return data;
};

// Obtener todas las citas de un psicólogo
export const getAppointmentsByPsychologist = async (psychologistId: string) => {
  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .eq("psychologist_id", psychologistId);
  if (error) throw new Error(error.message);
  return data;
};

// Obtener detalles de una cita
export const getAppointmentDetails = async (appointmentId: string) => {
  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .eq("id", appointmentId)
    .single(); // Devuelve solo un resultado
  if (error) throw new Error(error.message);
  return data;
};

// Actualizar el estado de una cita
export const updateAppointmentStatus = async (
  appointmentId: string,
  status: string
) => {
  const { data, error } = await supabase
    .from("appointments")
    .update({ status })
    .eq("id", appointmentId);
  if (error) throw new Error(error.message);
  return data;
};

// Agregar un registro de pago
export const addPayment = async (
  userId: string,
  amount: number,
  paymentMethod: string
) => {
  const { data, error } = await supabase.from("payments").insert([
    {
      user_id: userId,
      amount,
      payment_method: paymentMethod,
      payment_status: "pending",
    },
  ]);
  if (error) throw new Error(error.message);
  return data;
};

// Obtener todos los pagos de un usuario
export const getPaymentsByUser = async (userId: string) => {
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .eq("user_id", userId);
  if (error) throw new Error(error.message);
  return data;
};

// Actualizar el estado de un pago
export const updatePaymentStatus = async (
  paymentId: string,
  status: string
) => {
  const { data, error } = await supabase
    .from("payments")
    .update({ payment_status: status })
    .eq("id", paymentId);
  if (error) throw new Error(error.message);
  return data;
};

// Agregar un nuevo usuario
export const addUser = async (
  full_name: string,
  email: string,
  password: string,
  role:string
) => {
  const { data, error } = await supabase
    .from("users")
    .insert([{ full_name, email, password, role }]) // Asegúrate de tener los campos correctos en tu tabla "users"
    .select();
    if (error) throw new Error(error.message);
  return data;
};

// Agregar un nuevo psicólogo
export const addPsychologist = async (
    userId: string,  // ID del usuario que se va a asociar
    specialty: string,
    bio: string,  // Agregado para bio
    pricePerHour: string,  // Precio por hora
    availability: string  // Disponibilidad
  ) => {
    const { data, error } = await supabase
      .from("psychologists")
      .insert([{
        user_id: userId,  // Asociamos al psicólogo con un usuario existente
        specialty, 
        bio, 
        price_per_hour: parseFloat(pricePerHour),  // Aseguramos que sea un número decimal
        availability: JSON.parse(availability),  // Parseamos la disponibilidad si es un JSON
      }]); 
  
    if (error) throw new Error(error.message);
    return data;
  };
  
