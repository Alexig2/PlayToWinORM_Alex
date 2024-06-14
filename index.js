require("dotenv").config();
const conn = require("./db/conn");
const Usuario = require("./models/Usuario");
const Jogo = require("./models/Jogo");
const express = require("express");
const app = express();
const handlebars = require("express-handlebars");

app.engine("handlebars", handlebars.engine());

app.set("view engine", "handlebars");

app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(express.json());

app.get("/usuarios/novo", (req, res) => {
    res.render(`formUsuario`);
});

app.get("/", (req, res) => {
    res.render(`home`);
});

app.get("/usuarios", async (req, res) => {
    const usuarios = await Usuario.findAll({ raw: true })
    res.render(`usuarios`, { usuarios });
});

app.get("/jogos/novo", (req, res) => {
    res.render(`formJogo`);
});

app.post("/usuarios/novo", async (req, res) => {
    const dadosUsuario = {
        nickname: req.body.nickname,
        nome: req.body.nome,
    };
    const usuario = await Usuario.create(dadosUsuario);
    res.send("Usuário inserido sobre o id " + usuario.id);
});

app.post("/jogos/novo", async (req, res) => {
    const dadosJogo = {
        titulo: req.body.titulo,
        descricao: req.body.descricao,
        precoBase: req.body.precoBase,
    };
    const jogo = await Jogo.create(dadosJogo);
    res.send("Jogo inserido sobre o id " + jogo.id);
});


app.get("/usuarios/:id/atualizar", async (req, res) => {
    const id = req.params.id;
    const usuario = await Usuario.findByPk(id, { raw: true });
    res.render("formUsuario", { usuario });
});

app.post("/usuarios/:id/atualizar", async (req, res) => {
    const id = req.params.id;
    const dadosUsuario = {
        nickname: req.body.nickname,
        nome: req.body.nome,
    };
    
    const registrosAfetados = await Usuario.update(dadosUsuario, { where: { id: id } });
    
    if (registrosAfetados > 0) {
        res.redirect("/usuarios");
    } else {
        res.send("Erro ao atualizar usuário!");
    };
});

app.post("/usuarios/excluir", async (req, res) => {
    const id = req.body.id;
    const registrosAfetados = await Usuario.destroy({ where: { id: id } });
    
    if (registrosAfetados > 0) {
        res.redirect("/usuarios");
    } else {
        res.send("Erro ao excluir usuário!");
    };
});

app.listen(8000, () => {
    console.log("Server rodando!");
});

conn
    .sync()
    .then(() => {
        console.log("Banco de dados conectado e estrutura sincronizada.");
    })
    .catch((err) => {
        console.log("Erro ao conectar/sincronizar o banco de dados: " + err);
    });