require("dotenv").config();
const conn = require("./db/conn");
const express = require("express");
const app = express();
const handlebars = require("express-handlebars");
const Usuario = require("./models/Usuario");
const Jogo = require("./models/Jogo");
const Conquista = require("./models/Conquista");

app.engine("handlebars", handlebars.engine());

app.set("view engine", "handlebars");

app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(express.json());

app.get("/", (req, res) => {
    res.render(`home`);
});

app.get("/usuarios", async (req, res) => {
    const usuarios = await Usuario.findAll({ raw: true })
    res.render(`usuarios`, { usuarios });
});

app.get("/jogos", async (req, res) => {
    const jogos = await Jogo.findAll({ raw: true })
    res.render(`jogos`, { jogos });
});

/*  app.get('/jogos/:id/conquistas', async (req, res) => {
    const id = parseInt(req.params.id);
    const jogo = await Jogo.findByPk(id, { include: ['Conquistas'] });

    let conquistas = jogo.Conquistas;
    conquistas = conquistas.map((conquista) => conquista.toJSON());

    res.render('conquistas', {
        jogo: jogo.toJSON(),
        conquistas,
    });
});*/

app.get("/jogos/:id/conquistas", async (req, res) => {
    const id = parseInt(req.params.id);
    const jogo = await Jogo.findByPk(id, { raw: true });
  
    const conquistas = await Conquista.findAll({
      raw: true,
      where: { JogoId: id },
    });
  
    res.render("conquistas.handlebars", { jogo, conquistas });
  });

app.get("/usuarios/novo", (req, res) => {
    res.render(`formUsuario`);
});

app.get("/jogos/novo", (req, res) => {
    res.render(`formJogo`);
});

app.get('/jogos/:id/novaConquista', async (req, res) => {
    const id = parseInt(req.params.id);
    const jogo = await Jogo.findByPk(id, { raw: true });

    res.render('formConquista', { jogo });
})

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

app.post("/jogos/:id/novaConquista", async (req, res) => {
    const id = parseInt(req.params.id);

    const dadosConquista = {
        titulo: req.body.titulo,
        descricao: req.body.descricao,
        JogoId: id,
    };

    await Conquista.create(dadosConquista);

    res.redirect(`/jogos/${id}/conquistas`);
});

app.get("/usuarios/:id/atualizar", async (req, res) => {
    const id = req.params.id;
    const usuario = await Usuario.findByPk(id, { raw: true });
    res.render("formUsuario", { usuario });
});

app.get("/jogos/:id/atualizar", async (req, res) => {
    const id = req.params.id;
    const jogo = await Jogo.findByPk(id, { raw: true });
    res.render("formJogo", { jogo });
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

app.post("/jogos/:id/atualizar", async (req, res) => {
    const id = req.params.id;
    const dadosJogo = {
        titulo: req.body.titulo,
        descricao: req.body.descricao,
        precoBase: req.body.precoBase,
    };
    const registrosAfetados = await Jogo.update(dadosJogo, { where: { id: id } });

    if (registrosAfetados > 0) {
        res.redirect("/jogos");
    } else {
        res.send("Erro ao atualizar jogo!");
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

app.post("/jogos/excluir", async (req, res) => {
    const id = req.body.id;
    const registrosAfetados = await Jogo.destroy({ where: { id: id } });

    if (registrosAfetados > 0) {
        res.redirect("/jogos");
    } else {
        res.send("Erro ao excluir jogo!");
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