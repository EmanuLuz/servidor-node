// inportar o módulo nativo 'http' do node.js
const http = require('http');

// definir o endereço (localhost - minha máquina local) e a porta onde o servidor vai escutar hostbame
const hostname = '127.0.0.1';
const port = 3000;

// cria o servidor web
const server = http.createServer( (req, res) => {

    // define o status http como 200 (ok) e o tipo de conteuúo como texto plano em utf-8
});