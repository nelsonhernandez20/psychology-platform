"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth";
import { addPsychologist, addUser } from "@/lib/database";
import { supabase } from "@/lib/supabaseClient";

interface User {
  id: string;
  // otras propiedades del usuario si es necesario
}

const SignUpPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"user" | "psychologist">("user");
  const [fullName, setFullName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [bio, setBio] = useState("");
  const [pricePerHour, setPricePerHour] = useState("");
  const [availability, setAvailability] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Registro con correo y contraseña
      const userData = await signUp(email, password);

      // Guardar datos en la tabla de usuarios
      const user: any | null = await addUser(fullName, email, password, role);
      if (!user) {
        throw new Error("Failed to create user");
      }
      if (role === "psychologist" && user) {
        // Guardar datos del psicólogo solo si el rol es psicólogo
        const psychologistData: any = await addPsychologist(
          user[0].id, // Usamos el user.id para asociarlo al psicólogo
          specialization,
          bio, // Agregado para bio
          pricePerHour,
          availability
        );

        // Vincula el usuario con el psicólogo
        if (psychologistData && psychologistData.length > 0) {
          await supabase
            .from("psychologists")
            .update({ user_id: user.id })
            .eq("id", psychologistData[0].id);
        }
      }

      // Redirigir al perfil o al dashboard
      router.push("/profile");
    } catch (err: any) {
      setError(
        `Hubo un error al registrar la cuenta. Intenta de nuevo, ${err.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Registrarse
        </h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSignUp}>
          {/* Campos de usuario */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Nombre completo
            </label>
            <input
              id="fullname"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>
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

          {/* Selección de rol */}
          <div className="mb-6">
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700"
            >
              Eres:
            </label>
            <div className="flex items-center space-x-4">
              <div>
                <input
                  type="radio"
                  id="user"
                  name="role"
                  value="user"
                  checked={role === "user"}
                  onChange={() => setRole("user")}
                  className="mr-2"
                />
                <label htmlFor="user" className="text-sm">
                  Usuario
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  id="psychologist"
                  name="role"
                  value="psychologist"
                  checked={role === "psychologist"}
                  onChange={() => setRole("psychologist")}
                  className="mr-2"
                />
                <label htmlFor="psychologist" className="text-sm">
                  Psicólogo
                </label>
              </div>
            </div>
          </div>

          {/* Campos del psicólogo */}
          {role === "psychologist" && (
            <>
              <div className="mb-4">
                <label
                  htmlFor="specialization"
                  className="block text-sm font-medium text-gray-700"
                >
                  Especialización
                </label>
                <input
                  id="specialization"
                  type="text"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  required
                  className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="pricePerHour"
                  className="block text-sm font-medium text-gray-700"
                >
                  Precio por hora
                </label>
                <input
                  id="pricePerHour"
                  type="number"
                  value={pricePerHour}
                  onChange={(e) => setPricePerHour(e.target.value)}
                  required
                  className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="availability"
                  className="block text-sm font-medium text-gray-700"
                >
                  Disponibilidad
                </label>
                <input
                  id="availability"
                  type="text"
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  required
                  className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="bio"
                  className="block text-sm font-medium text-gray-700"
                >
                  Biografía
                </label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          >
            {loading ? "Cargando..." : "Registrar"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          ¿Ya tienes cuenta?{" "}
          <a href="/auth/login" className="text-blue-500 hover:underline">
            Iniciar sesión
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
