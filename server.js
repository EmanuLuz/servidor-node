// inportar o módulo nativo 'http' do node.js
const http = require('http');

// definir o endereço (localhost - minha máquina local) e a porta onde o servidor vai escutar hostbame
const hostname = '127.0.0.1';
const port = 3000;

// cria o servidor web
const server = http.createServer( (req, res) => {

    // define o status http como 200 (ok) e o tipo de conteuúo como texto plano em utf-8
    res.writeHead(200, {'Contentt-Type': 'UTF-8'});

    // envia a resposta para o navegador/cliente
    res.end('olá, alunos! O servidor Node.js está rodando com sucesso!\n');

});

// faz o servidor começar a escutar na porta definida
server.listen(port, hostname, () => {
    console.log(`Servidor rodando em http:// ${hostname}:${port}/`)
});