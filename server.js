// Importa o módulo nativo 'http' do Node.js
const http = require('http');

// Define o endereço (localhost) e a porta onde o servidor vai escutar
const hostname = '127.0.0.1';
const port = 3000;

// Cria o servidor web
const server = http.createServer((req, res) => {

    if (req.url === '/'){
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        return res.end('<h1>Página Inicial</h1>'); // o return impede a execução das linhas de baixo
    }

    if (req.url === '/alunos'){
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        return res.end('<h1>Lista de Alunos</h1>'); // o return impede a execução das linhas de baixo
    }

    // se nenhuma rota acima for satisfeita, cai no 404
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    
    // Envia a resposta para o navegador/cliente
    res.end('<h1 style="color: red;">404 - rota não encontrada</h1>');


});

// Faz o servidor começar a escutar na porta definida
server.listen(port, hostname, () => {
  console.log(`Servidor rodando em http://${hostname}:${port}/`);
});