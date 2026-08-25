import { hash } from "bcrypt";
import { searchByEmail, saveUser } from "../repositories/user.repository.js";
import { errorApp } from "../utils/ErrorApp.js";

export async function registerUser(datos) {
    const SALT_ROUNDS = 12;
    const emailRegex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const pwdRegex = /^(?=.*[a-z])(?=(.*[A-Z]))(?=.*\d)(?=.*[\W_]).{8,32}$/;

    const { name, last_name, email, password } = datos;

    if (!name || !last_name || !email || !password) {
        throw new errorApp("Todos los campos son obligatorios", 400);
    }

    if (!emailRegex.test(email)) {
        throw new errorApp("El formato del correo no es válido", 400);
    }

    if (!pwdRegex.test(password)) {
        throw new errorApp(
            "La contraseña no cumple con los requisitos de seguridad",
            400,
        );
    }

    const foundUser = await searchByEmail(email);
    if (foundUser) {
        throw new errorApp("El correo electrónico ya está registrado", 409);
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
            throw new errorApp(
                "El correo electrónico ya fue registrado por otro proceso",
                409,
            );
        }

        console.error("Error en la inserción física:", error);
        throw error;
    }

    return {
        message: "Usuario registrado correctamente",
        id: id,
    };
}
