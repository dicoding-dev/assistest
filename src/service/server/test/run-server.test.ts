import RunServer from "../run-server";
import Server from "../../../domain/sever/object/server";
import * as kill from 'kill-port';
import InvariantException from "../../../exception/invariant-exception";
import axios from "axios";


describe('run server test', () => {
    afterEach(() => {
        kill(5000, 'tcp')
    })

    it('should throw error when port is used', async function () {
        const port = 5000
        const server = new Server('./test/student-project/sample-project', 'localhost', port, 'start')

        const runServer = new RunServer()

        //fake server for first server
        const http = require('http')
        http.createServer().listen(port)

        // test second sever in same port
        await expect(runServer.run(server)).rejects.toThrow(new InvariantException(`Port ${port} is used`))
    });

    it('should run server properly', async function () {
        const port = 5000
        const host = 'localhost'
        const server = new Server('./test/student-project/sample-project', host, port, 'start')

        const runServer = new RunServer()
        await expect(runServer.run(server)).resolves.not.toThrow()

        const response = await axios.get(`http://${host}:${port}`)
        await expect(response.status).toStrictEqual(200)
    });

})