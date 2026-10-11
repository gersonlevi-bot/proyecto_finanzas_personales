export function validateSaltRounds(saltRoundsParam) {
    let saltRounds = Number(saltRoundsParam);

    if (
        Number.isNaN(saltRounds) ||
        !Number.isInteger(saltRounds) ||
        saltRounds < 10 ||
        saltRounds > 12
    ) {
        console.warn(`SALT_ROUNDS = ${saltRoundsParam} es invalido, se usa el valor por defecto`);
        saltRounds = 12;
    }

    return saltRounds;
}
