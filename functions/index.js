const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const { createClient } = require("@supabase/supabase-js");

// Inicializa Firebase Admin SDK
admin.initializeApp();

// Conectar a Supabase
const supabaseUrl = "https://jtnvboknbvzrfotixtve.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0bnZib2tuYnZ6cmZvdGl4dHZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc3NzAyMzQsImV4cCI6MjA1MzM0NjIzNH0.9vPSvYr5wUxuxdULPRFVLiNuOZkljWGgVPhlwa55n1I";
const supabase = createClient(supabaseUrl, supabaseKey);

// Configuración de Nodemailer con Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "nelsonvozjr@gmail.com", // Usa tu correo de Gmail
    pass: "kwfb bosg saqq clzj", // Contraseña de aplicación de Gmail
  },
});

exports.sendMeetingEmail = functions.https.onCall(async (data, context) => {
  const { psychologistId, clientEmail } = data;

  try {
    // Obtener el enlace de Google Meet desde Supabase
    const { data: psychologist, error } = await supabase
      .from("psychologists")
      .select("full_name, email, meet_link")
      .eq("id", psychologistId)
      .single();

    if (error) throw new Error("Error al obtener los datos del psicólogo");

    const mailOptions = {
      from: "nelsonvozjr@gmail.com", // Usa tu correo de Gmail
      to: [psychologist.email, clientEmail],
      subject: `Reunión con ${psychologist.full_name}`,
      text: `Hola, tu reunión está programada en el siguiente enlace: ${psychologist.meet_link}`,
      html: `<p>Hola, tu reunión está programada en el siguiente enlace: <a href="${psychologist.meet_link}">${psychologist.meet_link}</a></p>`,
    };

    await transporter.sendMail(mailOptions);
    return { success: true, message: "Correo enviado con éxito" };
  } catch (error) {
    console.error("Error enviando correo:", error);
    return { success: false, message: "Error al enviar el correo" };
  }
});