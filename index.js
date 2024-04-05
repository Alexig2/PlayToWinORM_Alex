require("dotenv").config();
const conn = require("./db/conn");
const Usuario = require("./models/Usuario");

conn
    .sync()
    .then(() => {
        console.log("Banco de dados conectado e estrutura sincronizada.");
    })
    .catch((err) => {
        console.log("Erro ao conectar/sincronizar o banco de dados: " + err);
    });