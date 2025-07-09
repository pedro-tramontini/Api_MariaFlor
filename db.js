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

    await client.query("INSERT INTO telefone (id_pessoa, numero) VALUES ($1, $2)", [idPessoa, telefone.numero])

    await client.query("INSERT INTO endereco (id_pessoa, rua, numero, bairro, cep, cod_cidade) VALUES ($1, $2, $3, $4, $5, $6)", [idPessoa, endereco.rua, endereco.numero, endereco.bairro, endereco.cep, cod_cid])
}

// LER CLIENTE

async function selecionarCliente(){
    const client = await connect();
    const res = await client.query(`SELECT c.id_pessoa, c.cpf, p.nome, p.email, e.rua, e.numero AS endereco, e.bairro, e.cep, t.codigo, t.numero AS telefone
        FROM cliente c
        JOIN pessoa p ON p.id = c.id_pessoa
        JOIN endereco e ON e.id_pessoa = c.id_pessoa
        JOIN telefone t ON t.id_pessoa = c.id_pessoa`)
    return res.rows;
}

// ATUALIZAR CLIENTE

async function atualizarCliente(id, pessoa, cliente, telefone, cidade, endereco) {
    const client = await connect();
    
    try {
        // Iniciar transação
        await client.query('BEGIN');

        // 1. Atualizar pessoa
        const pessoaResult = await client.query(
            "UPDATE pessoa SET nome = $1, email = $2 WHERE id = $3 RETURNING id", 
            [pessoa.nome, pessoa.email, id]
        );
        const idPessoa = pessoaResult.rows[0].id;

        // 2. Obter o código da cidade existente
        const cidadeExistente = await client.query(
            "SELECT cod_cidade FROM cidade WHERE id_pessoa = $1 LIMIT 1", 
            [idPessoa]
        );
        
        if (cidadeExistente.rows.length === 0) {
            throw new Error('Cidade não encontrada para este cliente');
        }
        
        const cod_cid = cidadeExistente.rows[0].cod_cidade;

        // 3. Atualizar cidade
        await client.query(
            "UPDATE cidade SET nome = $1, uf = $2 WHERE id_pessoa = $3 AND cod_cidade = $4", 
            [cidade.nome, cidade.uf, idPessoa, cod_cid]
        );

        // 4. Atualizar cliente
        await client.query(
            "UPDATE cliente SET cpf = $1 WHERE id_pessoa = $2", 
            [cliente.cpf, idPessoa]
        );

        // 5. Atualizar telefone
        await client.query(
            "UPDATE telefone SET codigo = $1, numero = $2 WHERE id_pessoa = $3", 
            [telefone.codigo, telefone.numero, idPessoa]
        );

        // 6. Atualizar endereço
        await client.query(
            "UPDATE endereco SET rua = $1, numero = $2, bairro = $3, cep = $4 WHERE id_pessoa = $5 AND cod_cidade = $6", 
            [endereco.rua, endereco.numero, endereco.bairro, endereco.cep, idPessoa, cod_cid]
        );

        // Confirmar transação
        await client.query('COMMIT');
    } catch (error) {
        // Reverter em caso de erro
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

// DELETAR CLIENTE

async function deletarCliente(idPessoa) {
  const client = await connect();

  try {
    await client.query('BEGIN');

    // Apaga telefones
    await client.query('DELETE FROM telefone WHERE id_pessoa = $1', [idPessoa]);

    // Apaga endereços
    await client.query('DELETE FROM endereco WHERE id_pessoa = $1', [idPessoa]);

    // Apaga cliente
    await client.query('DELETE FROM cliente WHERE id_pessoa = $1', [idPessoa]);

    // Apaga pessoa
    await client.query('DELETE FROM pessoa WHERE id = $1', [idPessoa]);

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  }
}








// CRUD DE ------------------------------ FUNCIONÁRIO
// CRUD DE ------------------------------ FUNCIONÁRIO
// CRUD DE ------------------------------ FUNCIONÁRIO
// CRUD DE ------------------------------ FUNCIONÁRIO

// CRIAR FUNCIONÁRIO
async function inserirFuncionario(pessoa, funcionario, telefone, cidade, endereco){
    const client = await connect();
    const insertPessoa = await client.query("INSERT INTO pessoa (nome, email) VALUES ($1, $2) RETURNING id", [pessoa.nome, pessoa.email])

    const insertCidade = await client.query("INSERT INTO cidade (nome, uf) VALUES ($1, $2) RETURNING codigo", [cidade.nome, cidade.uf])

    const idPessoa = insertPessoa.rows[0].id
    const cod_cid = insertCidade.rows[0].codigo
  
    await client.query("INSERT INTO funcionario (id_pessoa, cargo) VALUES ($1, $2)", [idPessoa, funcionario.cargo])

    await client.query("INSERT INTO telefone (id_pessoa, numero) VALUES ($1, $2)", [idPessoa, telefone.numero])

    await client.query("INSERT INTO endereco (id_pessoa, rua, numero, bairro, cep, cod_cidade) VALUES ($1, $2, $3, $4, $5, $6)", [idPessoa, endereco.rua, endereco.numero, endereco.bairro, endereco.cep, cod_cid])
}

// LER FUNCIONÁRIO

async function selecionarFuncionario(){
    const client = await connect();
    const res = await client.query(`SELECT f.id_pessoa, p.nome, f.cargo, p.email, e.rua, e.numero AS endereco, e.bairro, e.cep, t.codigo, t.numero AS telefone
        FROM funcionario f
        JOIN pessoa p ON p.id = f.id_pessoa
        JOIN endereco e ON e.id_pessoa = f.id_pessoa
        JOIN telefone t ON t.id_pessoa = f.id_pessoa`)
    return res.rows;
}

// ATUALIZAR FUNCIONÁRIO

async function atualizarFuncionario(id, pessoa, funcionario, telefone, cidade, endereco) {
    const client = await connect();
    
    try {
        await client.query('BEGIN'); // Iniciar transação

        // 1. Atualizar pessoa e obter id
        const pessoaResult = await client.query(
            "UPDATE pessoa SET nome = $1, email = $2 WHERE id = $3 RETURNING id", 
            [pessoa.nome, pessoa.email, id]
        );
        const idPessoa = pessoaResult.rows[0].id;

        // 2. Obter o código da cidade associada ao funcionário
        const cidadeExistente = await client.query(
            `SELECT c.codigo 
             FROM cidade c
             JOIN endereco e ON c.codigo = e.cod_cidade
             WHERE e.id_pessoa = $1`, 
            [idPessoa]
        );

        if (cidadeExistente.rows.length === 0) {
            throw new Error('Não foi encontrada cidade associada a este funcionário');
        }

        const cod_cid = cidadeExistente.rows[0].codigo;

        // 3. Atualizar cidade
        await client.query(
            "UPDATE cidade SET nome = $1, uf = $2 WHERE codigo = $3", 
            [cidade.nome, cidade.uf, cod_cid]
        );

        // 4. Atualizar funcionario
        await client.query(
            "UPDATE funcionario SET cargo = $1 WHERE id_pessoa = $2", 
            [funcionario.cargo, idPessoa]
        );

        // 5. Atualizar telefone
        await client.query(
            "UPDATE telefone SET numero = $1 WHERE id_pessoa = $2", 
            [telefone.numero, idPessoa]
        );

        // 6. Atualizar endereço
        await client.query(
            "UPDATE endereco SET rua = $1, numero = $2, bairro = $3, cep = $4 WHERE id_pessoa = $5 AND cod_cidade = $6", 
            [endereco.rua, endereco.numero, endereco.bairro, endereco.cep, idPessoa, cod_cid]
        );

        await client.query('COMMIT'); // Confirmar transação
    } catch (error) {
        await client.query('ROLLBACK'); // Reverter em caso de erro
        throw error;
    } finally {
        client.release(); // Liberar conexão
    }
}
// DELETAR FUNCIONÁRIO

async function deletarFuncionario(idPessoa) {
  const client = await connect();

  try {
    await client.query('BEGIN');

    // Apaga telefones
    await client.query('DELETE FROM telefone WHERE id_pessoa = $1', [idPessoa]);

    // Apaga endereços
    await client.query('DELETE FROM endereco WHERE id_pessoa = $1', [idPessoa]);

    // Apaga cliente
    await client.query('DELETE FROM funcionario WHERE id_pessoa = $1', [idPessoa]);

    // Apaga pessoa
    await client.query('DELETE FROM pessoa WHERE id = $1', [idPessoa]);

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  }
}








// CRUD DE ------------------------------ FORNECEDOR
// CRUD DE ------------------------------ FORNECEDOR
// CRUD DE ------------------------------ FORNECEDOR
// CRUD DE ------------------------------ FORNECEDOR
// CRIAR FORNECEDOR
async function inserirFornecedor(pessoa, fornecedor, telefone, cidade, endereco){
    const client = await connect();
    const insertPessoa = await client.query("INSERT INTO pessoa (nome, email) VALUES ($1, $2) RETURNING id", [pessoa.nome, pessoa.email])

    const insertCidade = await client.query("INSERT INTO cidade (nome, uf) VALUES ($1, $2) RETURNING codigo", [cidade.nome, cidade.uf])

    const idPessoa = insertPessoa.rows[0].id
    const cod_cid = insertCidade.rows[0].codigo

    await client.query("INSERT INTO fornecedor (id_pessoa, cnpj) VALUES ($1, $2)", [idPessoa, fornecedor.cnpj])

    await client.query("INSERT INTO telefone (id_pessoa, numero) VALUES ($1, $2)", [idPessoa, telefone.numero])

    await client.query("INSERT INTO endereco (id_pessoa, rua, numero, bairro, cep, cod_cidade) VALUES ($1, $2, $3, $4, $5, $6)", [idPessoa, endereco.rua, endereco.numero, endereco.bairro, endereco.cep, cod_cid])
}

// LER FUNCIONÁRIO

async function selecionarFornecedor(){
    const client = await connect();
    const res = await client.query(`SELECT f.id_pessoa, p.nome, f.cnpj, p.email, e.rua, e.numero AS endereco, e.bairro, e.cep, t.codigo, t.numero AS telefone
        FROM fornecedor f
        JOIN pessoa p ON p.id = f.id_pessoa
        JOIN endereco e ON e.id_pessoa = f.id_pessoa
        JOIN telefone t ON t.id_pessoa = f.id_pessoa`)
    return res.rows;
}

// ATUALIZAR FUNCIONÁRIO

async function atualizarFornecedor(id, pessoa, fornecedor, telefone, cidade, endereco) {
    const client = await connect();
    
    try {
        await client.query('BEGIN'); // Iniciar transação

        // 1. Atualizar pessoa e obter id
        const pessoaResult = await client.query(
            "UPDATE pessoa SET nome = $1, email = $2 WHERE id = $3 RETURNING id", 
            [pessoa.nome, pessoa.email, id]
        );
        const idPessoa = pessoaResult.rows[0].id;

        // 2. Obter o código da cidade associada ao fornecedor
        const cidadeExistente = await client.query(
            `SELECT c.codigo 
             FROM cidade c
             JOIN endereco e ON c.codigo = e.cod_cidade
             WHERE e.id_pessoa = $1`, 
            [idPessoa]
        );

        if (cidadeExistente.rows.length === 0) {
            throw new Error('Não foi encontrada cidade associada a este fornecedor');
        }

        const cod_cid = cidadeExistente.rows[0].codigo;

        // 3. Atualizar cidade
        await client.query(
            "UPDATE cidade SET nome = $1, uf = $2 WHERE codigo = $3", 
            [cidade.nome, cidade.uf, cod_cid]
        );

        // 4. Atualizar fornecedor
        await client.query(
            "UPDATE fornecedor SET cnpj = $1 WHERE id_pessoa = $2", 
            [fornecedor.cnpj, idPessoa]
        );

        // 5. Atualizar telefone
        await client.query(
            "UPDATE telefone SET numero = $1 WHERE id_pessoa = $2", 
            [telefone.numero, idPessoa]
        );

        // 6. Atualizar endereço
        await client.query(
            "UPDATE endereco SET rua = $1, numero = $2, bairro = $3, cep = $4 WHERE id_pessoa = $5 AND cod_cidade = $6", 
            [endereco.rua, endereco.numero, endereco.bairro, endereco.cep, idPessoa, cod_cid]
        );

        await client.query('COMMIT'); // Confirmar transação
        return { success: true, message: 'Fornecedor atualizado com sucesso' };
    } catch (error) {
        await client.query('ROLLBACK'); // Reverter em caso de erro
        console.error('Erro ao atualizar fornecedor:', error);
        throw error;
    } finally {
        client.release(); // Liberar conexão
    }
}

// DELETAR FUNCIONÁRIO

async function deletarFornecedor(idPessoa) {
  const client = await connect();

  try {
    await client.query('BEGIN');

    // Apaga telefones
    await client.query('DELETE FROM telefone WHERE id_pessoa = $1', [idPessoa]);

    // Apaga endereços
    await client.query('DELETE FROM endereco WHERE id_pessoa = $1', [idPessoa]);

    // Apaga cliente
    await client.query('DELETE FROM fornecedor WHERE id_pessoa = $1', [idPessoa]);

    // Apaga pessoa
    await client.query('DELETE FROM pessoa WHERE id = $1', [idPessoa]);

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  }
}





// CRUD DE ------------------------------ FORNECEDOR
// CRUD DE ------------------------------ FORNECEDOR
// CRUD DE ------------------------------ FORNECEDOR
// CRUD DE ------------------------------ FORNECEDOR
// CRIAR PRODUTO

async function inserirProduto(nome, tipo, preco){
    const client = await connect();

  try {
    const client = await connect();
    await client.query("INSERT INTO produto (nome, tipo, preco) VALUES ($1, $2, $3);", [nome, tipo, preco])
  } finally {
    await client.release(); // ou client.end() se não for pool
  }
  }

// LER PRODUTO

async function selecionarProduto() {
  const client = await connect();
    const res = await client.query('SELECT * FROM produto;');
    return res.rows;
}

async function selecionarProdutoPorId(id) {
  const client = await connect();
  const res = await client.query('SELECT * FROM produto WHERE id = $1;', [id]);
  return res.rows[0]; // retorna só um produto
}

// ATUALIZAR FUNCIONÁRIO

    async function atualizarProduto(id, nome, tipo, preco){
        const client = await connect();
        await client.query("UPDATE produto SET nome = $1, tipo = $2, preco = $3 WHERE id = $4", [nome, tipo, preco, id])
    }

// DELETAR FUNCIONÁRIO

async function deletarProduto(id) {
  const client = await connect();

  try {
    await client.query('BEGIN');

    // Apaga telefones
    await client.query('DELETE FROM produto WHERE id = $1;', [id]);

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  }
}


module.exports = {
    inserirCliente,
    selecionarCliente,
    selecionarProdutoPorId,
    atualizarCliente,
    deletarCliente,

    inserirFuncionario,
    selecionarFuncionario,
    atualizarFuncionario,
    deletarFuncionario,

    inserirFornecedor,
    selecionarFornecedor,
    atualizarFornecedor,
    deletarFornecedor,
    
    inserirProduto,
    selecionarProduto,
    atualizarProduto,
    deletarProduto

}