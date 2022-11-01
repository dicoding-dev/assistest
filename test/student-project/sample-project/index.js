const http = require('http')

const server = http.createServer((req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/plain'
    })

    res.end('Hi!')
})
server.listen(5000)