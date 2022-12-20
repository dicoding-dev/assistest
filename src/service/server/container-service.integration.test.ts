import axios from "axios";
import * as tcpPortUsed from 'tcp-port-used';
import ContainerService from "./container-service";
import SubmissionProject from "../../entities/submission-project/submission-project";
import {exec, execSync} from "child_process";
import * as kill from "tree-kill";
import PackageJson from "../../entities/submission-project/package-json";

describe('container service test', () => {
    afterEach(async () => {
        if (await isPortUsed(5000)){
            await execSync(' docker stop assistest')
        }
    });


    it.skip('should start & stop server', async function () {
        for (let i = 0; i < 10; i++) {
            const port = 5000
            await startFakeServer(port)

            expect(await isPortUsed(port)).toBeTruthy()
            await killPort(port)
            expect(await isPortUsed(port)).toBeFalsy()
        }
    });

    it('should throw error when port is used', async function () {
        const port = 5000
        const submissionProject: SubmissionProject = {
            packageJsonPath: 'test/student-project/sample-project',
            packageJsonContent: <PackageJson>{},
            runnerCommand: 'start'
        }

        const server = new ContainerService()

        //fake server for first server
        await startFakeServer(port)

        // test second sever in same port
        await expect(server.run(submissionProject)).rejects.toThrow(new Error(`Port ${port} is not available`))

        await killPort(5000)
    });

    it('should throw error and stop server when port is not used after project running', async function () {
        const submissionProject: SubmissionProject = {
            packageJsonPath: 'test/student-project/project-with-bad-port',
            packageJsonContent: <PackageJson>{},
            runnerCommand: 'start'
        }

        const server = new ContainerService()

        const spy = jest.spyOn(server, 'stop');

        await expect(server.run(submissionProject)).rejects.toThrow(Error)
        await expect(spy).toBeCalled()

        //wait real port to close
        await tcpPortUsed.waitUntilFree(5000, null, 2000)
    });


    it('should stop server properly', async function () {
        const port = 5000
        const host = 'localhost'
        const submissionProject:SubmissionProject = {
            packageJsonPath: 'test/student-project/sample-project',
            packageJsonContent: <PackageJson>{},
            runnerCommand: 'start'
        }

        const server = new ContainerService()
        await server.run(submissionProject)

        const response = await axios.get(`http://${host}:${port}`)
        await expect(response.status).toStrictEqual(200)

        //kill server
        await server.stop()
        expect(await isPortUsed(5000)).toBeFalsy()
    });
    //
    it('should run server properly', async function () {
        const port = 5000
        const host = 'localhost'
        const submissionProject:SubmissionProject = {
            packageJsonPath: 'test/student-project/sample-project',
            packageJsonContent: <PackageJson>{},
            runnerCommand: 'start'
        }

        const server = new ContainerService()
        await expect(server.run(submissionProject)).resolves.not.toThrow()

        const response = await axios.get(`http://${host}:${port}`)
        await expect(response.status).toStrictEqual(200)
    });

    async function startFakeServer(port) {
        exec(`PORT=${port} node index.js`, {
            cwd: './test/student-project/simple-server',
        })

        try {
            await tcpPortUsed.waitUntilUsed(port, null, 2000)
        } catch (e) {
            throw Error('Failed to start server')
        }
    }

    async function isPortUsed(port) {
        return tcpPortUsed.check(port, '127.0.0.1').then((inUse) => Promise.resolve(inUse)
            , function (e) {
                console.log(e)
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