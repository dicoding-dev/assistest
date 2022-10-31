import ServerStarter from "../server-starter";
import SubmissionProject from "../../../domain/sever/object/submissionProject";
import InvariantException from "../../../exception/invariant-exception";
import axios from "axios";
import * as tcpPortUsed from 'tcp-port-used';

describe('run server test', () => {
    afterEach(() => {
        // restore the spy created with spyOn
        jest.restoreAllMocks();
    });

    it('should throw error when port is used', async function () {
        const port = 5000
        const submissionProject = new SubmissionProject('./test/student-project/sample-project', 'localhost', port, 'start')

        const serverStarter = new ServerStarter()

        //fake server for first server
        const http = require('http')
        const fakeServer = http.createServer()
        fakeServer.listen(port)

        // test second sever in same port
        await expect(serverStarter.run(submissionProject)).rejects.toThrow(new InvariantException(`Port ${port} is used`))
        fakeServer.close()
    });

    it('should throw error and stop server when port is not used after project running', async function () {
        const wrongPort = 9999
        const host = 'localhost'
        // real project port is 5000
        const realPort = 5000
        const submissionProject = new SubmissionProject('./test/student-project/sample-project', host, wrongPort, 'start')

        const serverStarter = new ServerStarter()

        const spy = jest.spyOn(serverStarter, 'stop');

        await expect(serverStarter.run(submissionProject)).rejects.toThrow(Error)
        await expect(spy).toBeCalled()

        //wait real port to close
        await tcpPortUsed.waitUntilFree(realPort, null, 2000)
    });

    it('should stop server properly', async function () {
        const port = 5000
        const host = 'localhost'
        const submissionProject = new SubmissionProject('./test/student-project/sample-project', host, port, 'start')

        const serverStarter = new ServerStarter()
        await serverStarter.run(submissionProject)

        const response = await axios.get(`http://${host}:${port}`)
        await expect(response.status).toStrictEqual(200)

        //kill server
        await serverStarter.stop()

        //validate port 5000 is not used
        const http = require('http')
        const fakeServer = http.createServer()
        fakeServer.listen(port)
        fakeServer.close()
    });

    it('should run server properly', async function () {
        const port = 5000
        const host = 'localhost'
        const submissionProject = new SubmissionProject('./test/student-project/sample-project', host, port, 'start')

        const serverStarter = new ServerStarter()
        await expect(serverStarter.run(submissionProject)).resolves.not.toThrow()

        const response = await axios.get(`http://${host}:${port}`)
        await expect(response.status).toStrictEqual(200)

        await serverStarter.stop()
    });

})