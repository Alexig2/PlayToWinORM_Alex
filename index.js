require("dotenv").config();
const conn = require("./db/conn");
const Usuario = require("./models/Usuario");

const express = require("express");
const app = express();

app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(express.json());

app.get("/usuarios/novo", (req, res) => {
    res.sendFile(`${__dirname}/views/formUsuario.html`);
});

conn
    .sync()
    .then(() => {
        console.log("Banco de dados conectado e estrutura sincronizada.");
    })
    .catch((err) => {
        console.log("Erro ao conectar/sincronizar o banco de dados: " + err);
    });