import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
import { searchByEmail, saveUser } from "../repositories/user.repository.js";
import { ErrorApp } from "../utils/ErrorApp.js";
import dotenv from "dotenv";
dotenv.config();

export async function registerUser(datos) {
    const SALT_ROUNDS = 12;
    const emailRegex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const pwdRegex = /^(?=.*[a-z])(?=(.*[A-Z]))(?=.*\d)(?=.*[\W_]).{8,32}$/;

    const { name, last_name, email, password } = datos;

    if (!name || !last_name || !email || !password) {
        throw new ErrorApp("Todos los campos son obligatorios", 400);
    }

    if (!emailRegex.test(email)) {
        throw new ErrorApp("El formato del correo no es válido", 400);
    }

    if (!pwdRegex.test(password)) {
        throw new ErrorApp(
            "La contraseña no cumple con los requisitos de seguridad",
            400,
        );
    }

    const foundUser = await searchByEmail(email);
    if (foundUser) {
        throw new ErrorApp("El correo electrónico ya está registrado", 409);
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
            throw new ErrorApp(
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

export async function loginServices(dataLogin) {
    const dummyHash = "2b$12$dJYlUqbcG8ypyYZ8zLN5kO9UfEbq6/aJEXkHP9t8qUF24LuKA0hBK"
    const { email, password } = dataLogin;

    const user = await searchByEmail(email);
    if (!user) {
        await compare(password ,dummyHash)
        throw new ErrorApp("Correo o contraseña inválidos.", 401);
    }

    const isMatchPwd = await compare(password, user.password_hash);
    if (!isMatchPwd) throw new ErrorApp("Correo o contraseña inválidos.", 401);

    if (user.deleted_at !== null) {
        return {
            message:"Tu cuenta está en periodo de gracia, ¿quieres restablecerla?",
            isDeactivated: true,
        };
    }

    const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN },
    );

    delete user.password_hash;

    return {
        message: "Inicio de sesión exitoso.",
        token,
        user,
    };
}
