import { hash } from "bcrypt";
import { searchByEmail, saveUser } from "../repositories/user.repository";

export async function registerUser(datos) {
    const SALT_ROUNDS = 12
    const emailRegex =/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const pwdRegex = /^(?=.*[a-z])(?=(.*[A-Z]))(?=.*\d)(?=.*[\W_]).{8,32}$/;

    const { name, last_name, email, password } = datos;

    if (!name || !last_name || !email || !password) {
        throw new Error("Todos los campos son obligatorios");
    }

    if (!emailRegex.test(email)) {
        throw new Error("El formato del correo no es válido");
    }

    if (!pwdRegex.test(password)) {
        throw new Error(
        "La contraseña no cumple con los requisitos de seguridad");
    }

    const foundUser = await searchByEmail(email);
    if (!foundUser) {
        throw new Error("l correo electrónico ya está registrado");
    }

    const passwordHasheada = hash(password, SALT_ROUNDS)

    try {
        const id = await saveUser({name, last_name, email, passwordHasheada})
    } catch (error) {
        if(error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
            throw new Error('EMAIL_DUPLICADO_CONCURRENTE');
        }

        console.error("Error en la inserción física:", error);
        throw error;
    }

    return { 
        message: "Usuario registrado correctamente",
        id
    }

}
