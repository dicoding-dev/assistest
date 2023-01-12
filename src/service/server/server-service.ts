import {ChildProcess, spawn} from "child_process";
import * as tcpPortUsed from 'tcp-port-used';
import ServerErrorHandler from "./server-error-handler";
import SubmissionProject from "../../entities/submission-project/submission-project";
import {host, port} from "../../config/backend-pemula-project-requirement";
import {SubmissionRequirement} from "../../config/submission-requirement";

class ServerService {
    private _errorLog = [];
    private runningServer: ChildProcess;


    async run(submissionProject: SubmissionProject, submissionRequirement: SubmissionRequirement) {
        await this.validateBeforeStart()
        this.runningServer = spawn('npm', ['run', '--silent', submissionProject.runnerCommand], {cwd: submissionProject.packageJsonPath, detached: true})
        this.listenRunningServer(this.runningServer)

        try {
            await tcpPortUsed.waitUntilUsed(port, null, 3000)
            submissionRequirement.PROJECT_HAVE_CORRECT_PORT.status = true
        } catch (e) {
            const serverErrorHandler = new ServerErrorHandler(this._errorLog, submissionProject)
            await this.stop()

            serverErrorHandler.throwError()
        }
    }

    private listenRunningServer(runningServer: ChildProcess) {
        runningServer.stdout.on('data', async (data) => {
            if (process.env.DEBUG_MODE) {
                console.log(`stdout ${data}`);
            }
        });

        runningServer.stderr.on('data', (data) => {
            this._errorLog.push(data.toString())
            if (process.env.DEBUG_MODE) {
                console.log(`stderr ${data}`);
            }
        });

        if (process.env.DEBUG_MODE) {
            runningServer.on('close', () => {
                console.log('server killed')
            })
        }
    }

    async stop() {
        try {
            process.kill(-this.runningServer.pid)
            this._errorLog = []
            await tcpPortUsed.waitUntilFree(port, 500, 4000)
            console.log('success to kill server')
        } catch (e) {
            if (!e.message.includes('ESRCH')){
                throw new Error(`Failed to kill port ${port}, error: ${e}`)
            }
        }
    }

    private async validateBeforeStart() {
        const isUsed = await tcpPortUsed.check(port, host)

        if (isUsed) {
            const isUsed = await tcpPortUsed.check(port, host)
            if (isUsed) throw new Error(`Port ${port} is not available`)
        }
    }
}

export default ServerService