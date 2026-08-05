module.exports = (req , res, next) => { // es la petición que llega, res es la respuesta que va a
// devolver el servidor, next() le dice a Express que siga con la siguiente fucnión (sino la petición
// se queda trabada)

    console.log("Middleware de autenticación ejecutado");

    next();

};