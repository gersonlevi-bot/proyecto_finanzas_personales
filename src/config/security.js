import { validateSaltRounds } from "../utils/validateSaltRounds.js";
import { hash } from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

export const validSaltRounds = validateSaltRounds(process.env.SALT_ROUNDS);

let dummyHash = null;

export async function generateDummyHash() {
    const pwdFalse = "HOLAuser";
    dummyHash = await hash(pwdFalse, validSaltRounds);
}

export function getDummyHash() {
    if (dummyHash === null) throw new Error("El dummy no fue creado");

    return dummyHash;
}
