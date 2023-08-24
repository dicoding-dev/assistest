import axios from "axios";
import * as tcpPortUsed from 'tcp-port-used';
import ServerService from "./server-service";
import SubmissionProject from "../../entities/submission-project/submission-project";
import {spawn} from "child_process";
import PackageJson from "../../entities/submission-project/package-json";
import ProjectErrorException from "../../exception/project-error-exception";
import getSubmissionRequirement from "../../config/submission-requirement";

jest.setTimeout(11000)
describe('server service test', () => {
    const submissionRequirement = getSubmissionRequirement()
    it.skip('should start & stop server', async function () {
        for (let i = 0; i < 10; i++) {
            const port = 9000
            const serverPid = await startFakeServer(port)

            expect(await isPortUsed(port)).toBeTruthy()
            await killServer(serverPid, port)
            expect(await isPortUsed(port)).toBeFalsy()
        }
    });

    it('should throw error when port is used', async function () {
        const port = 9000
        const submissionProject: SubmissionProject = {
            packageJsonPath: 'test/student-project/sample-project',
            packageJsonContent: <PackageJson>{},
            runnerCommand: 'start'
        }

        const server = new ServerService()

        //fake container for first server
        const fakeServerPid = await startFakeServer(port)

        // test second sever in same port
        await expect(server.run(submissionProject, submissionRequirement)).rejects.toThrow(new Error(`Port ${port} is not available`))
        expect(submissionRequirement.project_have_correct_port.status).toBeFalsy()
        await killServer(fakeServerPid, port)
    });

    it('should throw error and stop server when app port is not 9000', async function () {
        const submissionProject: SubmissionProject = {
            packageJsonPath: 'test/student-project/project-with-bad-port',
            packageJsonContent: <PackageJson>{},
            runnerCommand: 'start'
        }

        const container = new ServerService()

        const spy = jest.spyOn(container, 'stop');
        await expect(container.run(submissionProject, submissionRequirement)).rejects.toThrow(new ProjectErrorException('PORT_NOT_MEET_REQUIREMENT'))
        await expect(spy).toBeCalled()
        expect(submissionRequirement.project_have_correct_port.status).toBeFalsy()
    });


    it('should stop container properly', async function () {
        const port = 9000
        const host = 'localhost'
        const submissionProject: SubmissionProject = {
            packageJsonPath: 'test/student-project/sample-project',
            packageJsonContent: <PackageJson>{},
            runnerCommand: 'start'
        }

        const container = new ServerService()
        await container.run(submissionProject, submissionRequirement)

        const response = await axios.get(`http://${host}:${port}`)
        await expect(response.status).toStrictEqual(200)
        expect(submissionRequirement.project_have_correct_port.status).toBeTruthy()

        //kill server
        await container.stop()
        expect(await isPortUsed(9000)).toBeFalsy()

    });
    //
    it('should run container properly', async function () {
        const port = 9000
        const host = 'localhost'
        const submissionProject: SubmissionProject = {
            packageJsonPath: 'test/student-project/sample-project',
            packageJsonContent: <PackageJson>{},
            runnerCommand: 'start'
        }

        const container = new ServerService()
        await expect(container.run(submissionProject, submissionRequirement)).resolves.not.toThrow()

        const response = await axios.get(`http://${host}:${port}`)
        await expect(response.status).toStrictEqual(200)
        expect(submissionRequirement.project_have_correct_port.status).toBeTruthy()


        await container.stop()
    });

    async function startFakeServer(port) {
        const server = spawn('node', ['index.js'], {
            cwd: './test/student-project/simple-server',
            detached: true
        })

        try {
            await tcpPortUsed.waitUntilUsed(port, null, 2000)
            return server.pid
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

    async function killServer(serverPid: number, port) {
        process.kill(-serverPid)
        try {
            await tcpPortUsed.waitUntilFree(port, 100, 4000)
        } catch (e) {
            console.log(e)
            throw Error('Failed to kill server')
        }
    }

})
