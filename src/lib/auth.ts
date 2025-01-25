import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "./firebaseConfig";

// Registro de usuario
export const signUp = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    return user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Inicio de sesión
export const login = async (email:string, password:string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    return user;
  } catch (error:any) {
    console.error("Error al iniciar sesión: ", error.message);
    throw new Error(error.message);
  }
};

// Cerrar sesión
export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(error.message);
  }
};
