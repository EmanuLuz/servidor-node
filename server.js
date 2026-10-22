const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'multiLinguas'
});

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err.stack);
    return;
  }
  console.log('Conectado ao MySQL com sucesso!');
});



// cadastro de usuário
app.post('/api/usuarios', (req, res) => {
  const {
    nome, email, senha, data_nascimento,
    faixa_etaria, tipo_perfil
  } = req.body;

  // validação backend
  if (!nome || !email || !senha || !data_nascimento || !faixa_etaria || !tipo_perfil) {
    return res.status(400).json({ message: 'Preencha todos os campos obrigatórios.' });
  }

  const senha_hash = senha;

  const sql = `
    INSERT INTO usuario
      (nome, email, senha_hash, data_nascimento, faixa_etaria, tipo_perfil)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const values = [nome, email, senha_hash, data_nascimento, faixa_etaria, tipo_perfil];

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error('Erro no INSERT:', err);

      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: 'Este e-mail já está cadastrado.' });
      }
      return res.status(500).json({ message: 'Erro ao cadastrar usuário no banco.' });
    }

    // Aparecer o id na tabela do mysql
    console.log('✅ Usuário salvo com sucesso! ID no MySQL:', result.insertId);

    res.status(201).json({
      message: 'Usuário cadastrado com sucesso!',
      id_usuario: result.insertId
    });
  });
});


// tentando conectar o login
// Login
app.post('/api/login', (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ message: 'Informe e-mail e senha.' });
  }

  // consulta na tabela usuario
  const sql = `
    SELECT id_usuario, nome, email, tipo_perfil 
    FROM usuario 
    WHERE email = ? AND senha_hash = ?
  `;

  connection.query(sql, [email, senha], (err, rows) => {
    if (err) {
      console.error('Erro no SELECT do login:', err);
      return res.status(500).json({ message: 'Erro interno no servidor.' });
    }

    if (rows.length === 0) {
      return res.status(401).json({ message: 'E-mail ou senha incorretos.' });
    }

    const u = rows[0];

    console.log(` Login efetuado: ${u.nome} (ID: ${u.id_usuario})`);

    res.json({
      message: 'Login realizado com sucesso',
      usuario: {
        id_usuario: u.id_usuario,
        nome: u.nome,
        email: u.email,
        tipo_perfil: u.tipo_perfil
      }
    });
  });
});

// progresso do usuário
app.get('/api/progresso/:id_usuario', (req, res) => {
  const { id_usuario } = req.params;
  const sql = 'SELECT * FROM progresso_aprendizado WHERE id_usuario = ? ORDER BY data_registro DESC';

  connection.query(sql, [id_usuario], (err, results) => {
    if (err) {
      console.error('Erro ao consultar progresso:', err);
      return res.status(500).json({ message: 'Erro ao buscar dados de progresso.' });
    }
    res.json(results);
  });
});

// apagar um registro do histórico
app.delete('/api/progresso/:id_progresso', (req, res) => {
  const { id_progresso } = req.params;
  const sql = 'DELETE FROM progresso_aprendizado WHERE id_progresso = ?';

  connection.query(sql, [id_progresso], (err, result) => {
    if (err) {
      console.error('Erro ao excluir progresso:', err);
      return res.status(500).json({ message: 'Erro ao apagar registro.' });
    }
    res.json({ message: 'Registro excluído com sucesso!' });
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}/`);
});