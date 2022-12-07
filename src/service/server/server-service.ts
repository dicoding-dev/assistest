import {ChildProcess, exec, execSync, spawnSync} from "child_process";
import * as tcpPortUsed from 'tcp-port-used';
import * as kill from 'tree-kill';
import ServerErrorHandler from "./server-error-handler";
import SubmissionProject from "../../entities/submission-project/submission-project";
import {host, port} from "../../conifg/backend-pemula-project-requirement";
import ProjectErrorException from "../../exception/project-error-exception";

class ServerService {
    private _errorLog = [];
    private serverPid: number

    async run(submissionProject: SubmissionProject) {
        await this.validateBeforeStart()

        const command = `npm run ${submissionProject.runnerCommand} -- --path=$(pwd)`
        const runningServer = exec(command, {cwd: submissionProject.packageJsonPath});
        this.serverPid = runningServer.pid

        this.listenRunningServer(runningServer)
        try {
            await tcpPortUsed.waitUntilUsed(port, null, 3000)
        } catch (e) {
            await this.checkPortMeetRequirementOrNot(submissionProject.packageJsonPath)
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

    private async checkPortMeetRequirementOrNot(packageJsonPath) {
        const pid = execSync(`ps aux | grep "${packageJsonPath}" | grep "node " | grep -v node_modules | awk '{print $2}'`, {encoding: "utf-8"}).trim()
        const appPort = execSync(`ss -l -p -n | grep pid=${pid} | awk '{print $5}' | cut -f2 -d ":"`, {encoding: "utf-8"}).trim()
        if (parseInt(appPort) !== port) {
            await this.killProcess(packageJsonPath, port)
            throw new ProjectErrorException('PORT_NOT_MEET_REQUIREMENT')
        }
    }

    private async killProcess(key: string, appPort: number) {
        spawnSync(`pkill`, ["-f", key])
        await tcpPortUsed.waitUntilFree(appPort, 500, 4000)
    }

    async stop() {
        try {
            this._errorLog = []
            kill(this.serverPid)
            await tcpPortUsed.waitUntilFree(port, 500, 4000)
            await tcpPortUsed.waitUntilFree(port, 500, 4000)
            console.log('success to kill port')
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