process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const app = require("./src/app");

app.listen(3000, () => {
    console.log("Servidor corriendo");
});