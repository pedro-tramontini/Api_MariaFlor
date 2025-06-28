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

app.get("/cidades", async (req, res) => {
    const clientes = await db.selectCidade();
    res.json(clientes);
})

app.post("/cadastrar-pessoa", async (req, res) => {
    await db.inserirPessoa(req.body);
    res.sendStatus(201)
})

app.get("/listar-pessoa", async (req, res) => {
    const pessoa = await db.selectPessoa();
    res.json(pessoa);
})




app.listen(port);

console.log("Backend rodando");