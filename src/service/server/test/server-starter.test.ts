import ServerStarter from "../server-starter";
import Server from "../../../domain/sever/object/server";
import * as kill from 'kill-port';
import InvariantException from "../../../exception/invariant-exception";
import axios from "axios";


describe('run server test', () => {
    it('should throw error when port is used', async function () {
        const port = 5000
        const server = new Server('./test/student-project/sample-project', 'localhost', port, 'start')

        const serverStarter = new ServerStarter()

        //fake server for first server
        const http = require('http')
        const fakeServer = http.createServer()
        fakeServer.listen(port)

        // test second sever in same port
        await expect(serverStarter.run(server)).rejects.toThrow(new InvariantException(`Port ${port} is used`))
        fakeServer.close()
    });

    it('should run server properly', async function () {
        const port = 5000
        const host = 'localhost'
        const server = new Server('./test/student-project/sample-project', host, port, 'start')

        const serverStarter = new ServerStarter()
        await expect(serverStarter.run(server)).resolves.not.toThrow()

        const response = await axios.get(`http://${host}:${port}`)
        await expect(response.status).toStrictEqual(200)

        kill(port, 'tcp')
    });

})