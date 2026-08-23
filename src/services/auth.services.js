import { hash } from "bcrypt";
import { searchByEmail, saveUser } from "../repositories/user.repository.js";

export async function registerUser(datos) {
    const SALT_ROUNDS = 12;
    const emailRegex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const pwdRegex = /^(?=.*[a-z])(?=(.*[A-Z]))(?=.*\d)(?=.*[\W_]).{8,32}$/;

    const { name, last_name, email, password } = datos;

    if (!name || !last_name || !email || !password) {
        const error = new Error("Todos los campos son obligatorios");
        error.statusCode = 400;
        throw error;
    }

    if (!emailRegex.test(email)) {
        const error = new Error("El formato del correo no es válido");
        error.statusCode = 400;
        throw error;
    }

    if (!pwdRegex.test(password)) {
        const error = new Error("La contraseña no cumple con los requisitos de seguridad",);
        error.statusCode = 400;
    }

    const foundUser = await searchByEmail(email);
    if (foundUser) {
        const error = new Error("El correo electrónico ya está registrado");
        error.statusCode = 400;
        throw error;
    }

    const passwordHasheada = await hash(password, SALT_ROUNDS);
    let id;

    try {
        id = await saveUser({
            name,
            last_name,
            email,
            password_hash: passwordHasheada,
        });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY" || error.errno === 1062) {
            const errorConflict = new Error("El correo electrónico ya fue registrado por otro proceso");
            errorConflict.statusCode = 409;
            throw errorConflict;
        }

        console.error("Error en la inserción física:", error);
        throw error;
    }

    return {
        message: "Usuario registrado correctamente",
        id: id,
    };
}
