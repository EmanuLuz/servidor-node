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

// -------- Cadastro de usuário --------
app.post('/api/usuarios', (req, res) => {
  const {
    nome, email, senha, data_nascimento,
    faixa_etaria, tipo_perfil
  } = req.body;

  if (!nome || !email || !senha || !data_nascimento || !faixa_etaria || !tipo_perfil) {
    return res.status(400).json({ message: 'Preencha todos os campos obrigatórios.' });
  }

  const senha_hash = senha; // TODO: usar bcrypt

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
      return res.status(500).json({ message: 'Erro ao cadastrar usuário.' });
    }

    res.status(201).json({
      message: 'Usuário cadastrado com sucesso!',
      id_usuario: result.insertId
    });
  });
});


// tentando conectar o login
// -------- Login --------
app.post('/api/login', (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ message: 'Informe e-mail e senha.' });
  }

  const sql = 'SELECT * FROM usuario WHERE email = ? AND senha_hash = ?';

  connection.query(sql, [email, senha], (err, rows) => {
    if (err) {
      console.error('Erro no SELECT:', err);
      return res.status(500).json({ message: 'Erro no servidor.' });
    }

    if (rows.length === 0) {
      return res.status(401).json({ message: 'E-mail ou senha incorretos.' });
    }

    const u = rows[0];
    res.json({
      message: 'Login OK',
      usuario: {
        id_usuario: u.id_usuario,
        nome: u.nome,
        email: u.email,
        tipo_perfil: u.tipo_perfil
      }
    });
  });
});


app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}/`);
});