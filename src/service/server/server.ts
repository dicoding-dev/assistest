import {ChildProcess, exec} from "child_process";
import * as tcpPortUsed from 'tcp-port-used';
import * as kill from 'tree-kill';
import SubmissionProject from "../../entities/submission-project/submission-project";
import ServerErrorException from "../../exception/server-error-exception";


class Server {
    private _errorLog = [];
    private serverPort: number;
    private serverPid: number

    async run(submissionProject: SubmissionProject) {
        await this.validateBeforeStart(submissionProject)
        const {runnerCommand, projectPath, port} = submissionProject

        this.serverPort = port

        const command = `npm ${runnerCommand}`
        const runningServer = exec(command, {cwd: projectPath});
        this.serverPid = runningServer.pid

        this.listenRunningServer(runningServer)
        try {
            await tcpPortUsed.waitUntilUsed(port, null, 2000)
        } catch (e) {
            await this.stop()
            throw new ServerErrorException(`SERVER_ERROR`,
                `message: ${e.message}
            command: ${command}
            path: ${projectPath}
            hint: Maybe the port server is not 5000`,
                this._errorLog
            )
        }
    }

    private listenRunningServer(runningServer: ChildProcess) {
        runningServer.stdout.on('data', async (data) => {
            // if (process.env.DEBUG_MODE) {
            console.log(`stdout ${data}`);
            // }
        });

        runningServer.stderr.on('data', (data) => {
            this._errorLog.push(data)
            // if (process.env.DEBUG_MODE) {
            console.log(`stderr ${data}`);
            // }
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
            await tcpPortUsed.waitUntilFree(this.serverPort, 500, 4000)
        } catch (e) {
            throw new Error(`Failed to kill port ${this.serverPort}, error: ${e}`)
        }

    }

    private async validateBeforeStart({port, host}) {
        const isUsed = await tcpPortUsed.check(port, host)

        if (isUsed) {
            throw new ServerErrorException(`PORT_IS_USED`, `Port ${port} is not available`)
        }
    }
}

export default Server