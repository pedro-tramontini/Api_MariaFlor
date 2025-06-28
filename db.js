async function connect(){

    if(global.connection)
        return global.connection.connect();

    const { Pool } = require("pg")
    const pool = new Pool({
        connectionString: process.env.CONNECTION_STRING
    });

    const client = await pool.connect();
    console.log("Criou o pool conexão");

    const res = await client.query("select now()")
    console.log(res.rows[0])
    client.release();

    global.connection = pool;
    return pool.connect();

}

connect();

// CRUD DE ----- CLIENTE

// CRIAR CLIENTE

async function inserirCliente(pessoa, cliente, telefone, cidade, endereco){
    const client = await connect();
    const insertPessoa = await client.query("INSERT INTO pessoa (nome, email) VALUES ($1, $2) RETURNING id", [pessoa.nome, pessoa.email])

    const insertCidade = await client.query("INSERT INTO cidade (nome, uf) VALUES ($1, $2) RETURNING codigo", [cidade.nome, cidade.uf])

    const idPessoa = insertPessoa.rows[0].id
    const cod_cid = insertCidade.rows[0].codigo

    await client.query("INSERT INTO cliente (id_pessoa, cpf) VALUES ($1, $2)", [idPessoa, cliente.cpf])

    await client.query("INSERT INTO telefone (id_pessoa, codigo, numero) VALUES ($1, $2, $3)", [idPessoa, telefone.codigo, telefone.numero])

    await client.query("INSERT INTO endereco (id_pessoa, rua, numero, bairro, cep, cod_cidade) VALUES ($1, $2, $3, $4, $5, $6)", [idPessoa, endereco.rua, endereco.numero, endereco.bairro, endereco.cep, cod_cid])
}

// LER PESSOA

async function selecionarCliente(){
    const client = await connect();
    const res = await client.query(`SELECT c.id_pessoa, c.cpf, p.nome, p.email, e.rua, e.numero AS endereco, e.bairro, e.cep, t.codigo, t.numero AS telefone
        FROM cliente c
        JOIN pessoa p ON p.id = c.id_pessoa
        JOIN endereco e ON e.id_pessoa = c.id_pessoa
        JOIN telefone t ON t.id_pessoa = c.id_pessoa`)
    return res.rows;
}

// ATUALIZAR PESSOA


module.exports = {
    inserirCliente,
    selecionarCliente
}