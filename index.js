require("dotenv").config();

const db = require("./db")

const port = process.env.PORT;

const express = require("express");

const app = express();

app.use(express.json())

app.get("/", (req, res) => {
    res.json({
        message: "Funcionando!"
    })
})

// ROTAS DO CRUD DE CLIENTE

app.post("/cadastrar-cliente", async (req, res) => {
    const { pessoa, cliente, telefone, cidade, endereco } = req.body;

    await db.inserirCliente(pessoa, cliente, telefone, cidade, endereco);
    res.sendStatus(201)
})

app.get("/listar-cliente", async (req, res) => {
    const pessoa = await db.selecionarCliente();
    res.json(pessoa);
})




app.listen(port);

console.log("Backend rodando");