const app = require("./src/app");

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";