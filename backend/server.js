require("dotenv").config({ path: require("path").join(__dirname, ".env") });

if (process.env.NODE_ENV !== "production") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

const app = require("./src/app");

app.listen(3000, () => {
    console.log("Servidor corriendo");
});