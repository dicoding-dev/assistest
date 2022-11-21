import {ChildProcess, exec} from "child_process";
import * as tcpPortUsed from 'tcp-port-used';
import * as kill from 'tree-kill';
import ServerErrorHandler from "./server-error-handler";
import SubmissionProject from "../../entities/submission-project/submission-project";
import {host, port} from "../../conifg/backend-pemula-project-requirement";

class ServerService {
    private _errorLog = [];
    private serverPid: number

    async run(submissionProject: SubmissionProject) {
        await this.validateBeforeStart()

        const command = `npm ${submissionProject.runnerCommand}`
        const runningServer = exec(command, {cwd: submissionProject.packageJsonPath});
        this.serverPid = runningServer.pid

        this.listenRunningServer(runningServer)
        try {
            await tcpPortUsed.waitUntilUsed(port, null, 2000)
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
            kill(this.serverPid)
            await tcpPortUsed.waitUntilFree(port, 500, 4000)
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