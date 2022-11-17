import axios from "axios";
import * as tcpPortUsed from 'tcp-port-used';
import Server from "./server";
import SubmissionProject from "../../entities/submission-project/submission-project";
import {exec, execSync, spawn, spawnSync} from "child_process";
import {port} from "../../conifg/backend-pemula-project-requirement";
import * as killPort from 'kill-port'
import * as kill from "tree-kill";

describe('run server test', () => {
    jest.setTimeout(100000)
    // afterEach(async () => {
    //     // restore the spy created with spyOn
    //     jest.restoreAllMocks();
    //
    //     try {
    //
    //
    //     tcpPortUsed.check(port, '127.0.0.1')
    //         .then(function(inUse) {
    //             console.log(`Port ${port}} usage: `+inUse);
    //             if (inUse){
    //                 console.log('stopping server')
    //                 const ls = spawn(`kill`, ['-9 $(lsof -t -i:${5000})'])
    //
    //
    //                 ls.stdout.on('data', (data) => {
    //                     console.log(`stdout: ${data}`);
    //                 });
    //
    //                 ls.stderr.on('data', (data) => {
    //                     console.error(`stderr: ${data}`);
    //                 });
    //
    //                 ls.on('close', (code) => {
    //                     console.log(`child process exited with code ${code}`);
    //                 });
    //
    //
    //                 console.log('done stopping server')
    //             }
    //         }, function(err) {
    //             console.error('Error on check:', err.message);
    //         });
    //
    //
    //     const a = await tcpPortUsed.waitUntilFree(port, null, 10000)
    //     console.log(a)
    //     }catch (e) {
    //         console.log(e)
    //     }
    //
    //
    //     // await new Promise(resolve => setTimeout(resolve, 1000))
    //     console.log('done stopping server')
    // });


    it.skip('should start & stop server', async function () {
        for (let i = 0; i <10; i++) {
            const port = 5000
            await startFakeServer(port)

            expect(await isPortUsed(port, 'first')).toBeTruthy()
            await killPort(port)
            expect(await isPortUsed(port, "second")).toBeFalsy()
        }
    });

    it('should throw error when port is used', async function () {
        const port = 5000
        const submissionProject = new SubmissionProject(new ProjectPath('test/student-project/sample-project'), 'localhost', port, 'start')

        const server = new Server()

        //fake server for first server
        const http = require('http')
        const fakeServer = http.createServer()
        fakeServer.listen(port)

        // test second sever in same port
        await expect(server.run(submissionProject)).rejects.toThrow(new Error(`Port ${port} is not available`))
        fakeServer.close()
    });

    it('should throw error and stop server when port is not used after project running', async function () {
        const wrongPort = 9999
        const host = 'localhost'
        // real project port is 5000
        const realPort = 5000
        const submissionProject = new SubmissionProject(new ProjectPath('./test/student-project/sample-project'), host, wrongPort, 'start')

        const server = new Server()

        const spy = jest.spyOn(server, 'stop');

        await expect(server.run(submissionProject)).rejects.toThrow(Error)
        await expect(spy).toBeCalled()

        //wait real port to close
        await tcpPortUsed.waitUntilFree(realPort, null, 2000)
    });

    it('should stop server properly', async function () {
        const port = 5000
        const host = 'localhost'
        const submissionProject = new SubmissionProject(new ProjectPath('./test/student-project/sample-project'), host, port, 'start')

        const server = new Server()
        await server.run(submissionProject)

        const response = await axios.get(`http://${host}:${port}`)
        await expect(response.status).toStrictEqual(200)

        //kill server
        await server.stop()

        //validate port 5000 is not used
        const http = require('http')
        const fakeServer = http.createServer()
        fakeServer.listen(port)
        fakeServer.close()
    });

    it('should run server properly', async function () {
        const port = 5000
        const host = 'localhost'
        const submissionProject = new SubmissionProject(new ProjectPath('test/student-project/sample-project'), host, port, 'start')

        const server = new Server()
        await expect(server.run(submissionProject)).resolves.not.toThrow()

        const response = await axios.get(`http://${host}:${port}`)
        await expect(response.status).toStrictEqual(200)

        await server.stop()
    });

    async function startFakeServer(port) {
        exec('node index.js', {
            cwd: './test/student-project/simple-server',
        })

        try {
            await tcpPortUsed.waitUntilUsed(port, null, 2000)
        } catch (e) {
            throw Error('Failed to start server')
        }
    }

    async function isPortUsed(port, message: string) {
        return tcpPortUsed.check(port, '127.0.0.1').then((inUse) => Promise.resolve(inUse)
            , function (e) {
                console.log(e)
                console.log(message)
                throw new Error('Cannot check port')
            });
    }

    async function killPort(port: number) {
        const serverPid = await execSync(`lsof -t -i:${port}`)
        const parsedServerPid = parseInt(serverPid.toString())
        kill(parsedServerPid)
        try {
            await tcpPortUsed.waitUntilFree(port, 100, 4000)
        } catch (e) {
            console.log(e)
            throw Error('Failed to kill server')
        }
    }

})