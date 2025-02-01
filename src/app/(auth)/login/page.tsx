"use client"
import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useUser } from "@/contexts/userContext"; // Contexto donde guardaremos los datos
import { auth } from "@/lib/firebaseConfig";
import { supabase } from "@/lib/supabaseClient";

const LoginPage = () => {
  const router = useRouter();
  const { setUserData } = useUser(); // Usamos el contexto
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Autenticación con Firebase
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      // Buscamos el usuario en Supabase después de la autenticación
      if (user.email) {
        const userData = await fetchUserData(user.email);
        setUserData(userData);
      } else {
        throw new Error("User email is null");
      }
      // Guardamos los datos en el contexto

      // Redirigir según el rol
      // if (userData.role === "psychologist") {
      //   router.push("/psychologist/dashboard");
      // } else {
        router.push("/find-psychologist");
      // }
    } catch (err: any) {
      setError("Hubo un error al iniciar sesión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener los datos del usuario desde Supabase
  const fetchUserData = async (email: string) => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error) throw new Error(error.message);

    if (data.role === "psychologist") {
      const { data: psychologistData, error: psychologistError } =
        await supabase
          .from("psychologists")
          .select("*")
          .eq("user_id", data.id)
          .single();

      if (psychologistError) throw new Error(psychologistError.message);

      return { ...data, psychologist: psychologistData };
    }

    return data; // Si no es psicólogo, solo retornamos los datos del usuario
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Iniciar sesión
        </h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {loading ? "Cargando..." : "Iniciar sesión"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          ¿No tienes cuenta?{" "}
          <a href="/signup" className="text-blue-500 hover:underline">
            Registrarse
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
