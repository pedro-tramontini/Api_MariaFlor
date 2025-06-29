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

// CADASTRA CLIENTE
app.post("/cadastrar-cliente", async (req, res) => {
    const { pessoa, cliente, telefone, cidade, endereco } = req.body;

    await db.inserirCliente(pessoa, cliente, telefone, cidade, endereco);
    res.sendStatus(201)
})
// LISTA CLIENTE
app.get("/listar-cliente", async (req, res) => {
    const pessoa = await db.selecionarCliente();
    res.json(pessoa);
})
// ATUALIZA CLIENTE
app.put("/atualizar-cliente/:id", async (req, res) => {
    const { id } = req.params;
    const { pessoa, cliente, telefone, cidade, endereco } = req.body;

    await db.atualizarCliente(parseInt(id), pessoa, cliente, telefone, cidade, endereco);
    res.json(pessoa);
})
// DELETA CLIENTE
app.delete("/deletar-cliente/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await db.deletarCliente(parseInt(id));
    res.json({ message: `Cliente com id ${id} deletado com sucesso.` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});









// ROTAS DO CRUD DE FUNCIONÁRIO

// CADASTRA FUNCIONARIO
app.post("/cadastrar-funcionario", async (req, res) => {
    const { pessoa, funcionario, telefone, cidade, endereco } = req.body;

    await db.inserirFuncionario(pessoa, funcionario, telefone, cidade, endereco);
    res.sendStatus(201)
})
// LISTA FUNCIONARIO
app.get("/listar-funcionario", async (req, res) => {
    const pessoa = await db.selecionarFuncionario();
    res.json(pessoa);
})
// ATUALIZA FUNCIONARIO
app.put("/atualizar-funcionario/:id", async (req, res) => {
    const { id } = req.params;
    const { pessoa, funcionario, telefone, cidade, endereco } = req.body;

    await db.atualizarFuncionario(parseInt(id), pessoa, funcionario, telefone, cidade, endereco);
    res.json(pessoa);
})
// DELETA FUNCIONARIO
app.delete("/deletar-funcionario/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await db.deletarFuncionario(parseInt(id));
    res.json({ message: `Funcionario com id ${id} deletado com sucesso.` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});







// ROTAS DO CRUD DE FORNECEDOR

// CADASTRA FORNECEDOR
app.post("/cadastrar-fornecedor", async (req, res) => {
    const { pessoa, fornecedor, telefone, cidade, endereco } = req.body;

    await db.inserirFornecedor(pessoa, fornecedor, telefone, cidade, endereco);
    res.sendStatus(201)
})
// LISTA FORNECEDOR
app.get("/listar-fornecedor", async (req, res) => {
    const pessoa = await db.selecionarFornecedor();
    res.json(pessoa);
})
// ATUALIZA FORNECEDOR
app.put("/atualizar-fornecedor/:id", async (req, res) => {
    const { id } = req.params;
    const { pessoa, fornecedor, telefone, cidade, endereco } = req.body;

    await db.atualizarFornecedor(parseInt(id), pessoa, fornecedor, telefone, cidade, endereco);
    res.json(pessoa);
})
// DELETA FORNECEDOR
app.delete("/deletar-fornecedor/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await db.deletarFornecedor(parseInt(id));
    res.json({ message: `Fornecedor com id ${id} deletado com sucesso.` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port);

console.log("Backend rodando");