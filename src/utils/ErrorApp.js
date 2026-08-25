export class errorApp extends Error {
    constructor(msg, codigoStatus) {
        super(msg);
        this.codigoStatus = codigoStatus;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
