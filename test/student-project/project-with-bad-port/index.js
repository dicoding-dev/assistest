const port = 9999
const http = require('http')
const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World!\n');
});
server.listen(port, '127.0.0.1', () => {
    console.log(`Server running`);
});
