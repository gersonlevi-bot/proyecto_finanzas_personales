export function errorHandler(err, req, res, next) {
    if (err.isOperational) {
        console.log(err.message);
        return res.status(err.statusCode).json({ error: err.message });
    }

    console.error("Erros no controlado:", err);
    return res
        .status(500)
        .json({ error: "Ocurrio un error interno del servidor" });
}
