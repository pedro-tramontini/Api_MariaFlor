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

async function selectCidade(){
    const client = await connect();
    const res = await client.query("SELECT * FROM cidade")
    return res.rows;
}

async function inserirPessoa(pessoa){
    const client = await connect();
    const insertPessoa = await client.query("INSERT INTO pessoa (nome, email) VALUES ($1, $2) RETURNING id", [pessoa.nome, pessoa.email])

    const idPessoa = insertPessoa.rows[0].id

    await client.query("INSERT INTO cliente (id_pessoa, cpf) VALUES ($1, $2)", [idPessoa, pessoa.cpf])




    // const values = [pessoa.nome, pessoa.email];
    // await client.query(insertPessoa, values)
}

async function selectPessoa(){
    const client = await connect();
    const res = await client.query("SELECT * FROM pessoa")
    return res.rows;
}


module.exports = {
    selectCidade,
    inserirPessoa,
    selectPessoa
}