import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";
import { getPsychologistById, getUserById } from "@/lib/database";

// Conectar a Supabase
const supabaseUrl = "https://jtnvboknbvzrfotixtve.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0bnZib2tuYnZ6cmZvdGl4dHZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc3NzAyMzQsImV4cCI6MjA1MzM0NjIzNH0.9vPSvYr5wUxuxdULPRFVLiNuOZkljWGgVPhlwa55n1I";
const supabase = createClient(supabaseUrl, supabaseKey);

// Configuración de Nodemailer con Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "nelsonvozjr@gmail.com", // Usa tu correo de Gmail
    pass: "kwfb bosg saqq clzj", // Contraseña de aplicación de Gmail
  },
});

// Definir los tipos de datos esperados para la función
interface RequestBody {
  psychologistId: number;
  clientEmail: string;
}

export async function POST(req: Request) {
  const { psychologistId, clientEmail }: RequestBody = await req.json();

  try {
    // Obtener el enlace de Google Meet desde Supabase

    const dataUser = await getUserById(psychologistId.toString());
    const psychologist = await getPsychologistById(psychologistId.toString());

    const mailOptions = {
      from: "nelsonvozjr@gmail.com", // Usa tu correo de Gmail
      to: [dataUser.email, clientEmail],
      subject: `Reunión con ${dataUser.full_name}`,
      text: `Hola, tu reunión está programada en el siguiente enlace: ${psychologist.meet_link}`,
      html: `<p>Hola, tu reunión está programada en el siguiente enlace: <a href="${psychologist.meet_link}">${psychologist.meet_link}</a></p>`,
    };

    await transporter.sendMail(mailOptions);
    return new Response(
      JSON.stringify({ success: true, message: "Correo enviado con éxito" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error enviando correo:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Error al enviar el correo" }),
      { status: 500 }
    );
  }
}
