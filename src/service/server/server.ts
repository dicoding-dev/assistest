import SubmissionProject from "../../domain/sever/object/submission-project";
import {ChildProcess, exec} from "child_process";
import * as tcpPortUsed from 'tcp-port-used';
import InvariantException from "../../exception/invariant-exception";
import * as kill from 'tree-kill';


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
            throw new Error(`Server cannot started
            message: ${e.message}
            command: ${command}
            path: ${projectPath}
            hint: Maybe the port server is not 5000`
            )
        }
    }

    private listenRunningServer(runningServer: ChildProcess) {
        runningServer.stdout.on('data', async (data) => {
            console.log(`stdout ${data}`);
        });

        runningServer.stderr.on('data', (data) => {
            this._errorLog.push(data)
        });

        runningServer.on('close', () => {
            console.log('server killed')
        })
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
            throw new InvariantException(`Port ${port} is used`)
        }
    }
}

export default Server