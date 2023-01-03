import {ChildProcess, spawn} from "child_process";
import * as tcpPortUsed from 'tcp-port-used';
import ServerErrorHandler from "./server-error-handler";
import SubmissionProject from "../../entities/submission-project/submission-project";
import {host, port} from "../../config/backend-pemula-project-requirement";

class ServerService {
    private _errorLog = [];
    private runningServer: ChildProcess;


    async run(submissionProject: SubmissionProject) {
        await this.validateBeforeStart()
        this.runningServer = spawn('npm', ['run', submissionProject.runnerCommand], {cwd: submissionProject.packageJsonPath, detached: true})

        await new Promise(resolve => setTimeout(resolve, 1000));

        this.listenRunningServer(this.runningServer)
        try {
            await tcpPortUsed.waitUntilUsed(port, null, 3000)
        } catch (e) {
            await this.stop()
            const serverErrorHandler = new ServerErrorHandler(this._errorLog, submissionProject)
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
            this._errorLog.push(data)
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
            throw new Error(`Failed to kill port ${port}, error: ${e}`)
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