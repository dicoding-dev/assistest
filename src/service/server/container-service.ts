import {ChildProcess, exec, execSync} from "child_process";
import * as tcpPortUsed from 'tcp-port-used';
import ServerErrorHandler from "./server-error-handler";
import SubmissionProject from "../../entities/submission-project/submission-project";
import {host, port} from "../../conifg/backend-pemula-project-requirement";
import ProjectErrorException from "../../exception/project-error-exception";

class ContainerService {
    private _errorLog = [];

    async run(submissionProject: SubmissionProject) {
        await this.validateBeforeStart()

        this.prepareContainer(submissionProject.packageJsonPath)
        const command = `docker exec assistest npm run ${submissionProject.runnerCommand}`
        const runningServer = exec(command, {cwd: submissionProject.packageJsonPath});

        await new Promise(resolve => setTimeout(resolve, 1000));

        this.listenRunningServer(runningServer)
        try {
            this.checkRunningPortInsideDocker()
            await tcpPortUsed.waitUntilUsed(port, null, 3000)
        } catch (e) {
            await this.stop()
            const serverErrorHandler = new ServerErrorHandler(this._errorLog, submissionProject)
            serverErrorHandler.throwError()
        }
    }

    private prepareContainer(projectPath: string) {
        execSync('docker run --rm -dp 5000:80 -v "$(pwd):$(pwd)" -w "$(pwd)" --name assistest assistest-runner',
            {
                cwd: projectPath
            });
        console.log('start container')
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
        this.stopContainer()
        try {
            this._errorLog = []
            await tcpPortUsed.waitUntilFree(port, 500, 4000)
            console.log('success to kill container')
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

    private checkRunningPortInsideDocker() {
        const result = execSync('docker exec assistest  netstat -an | grep LISTEN | awk \'{print $4}\' | rev | cut -d: -f1 | rev')
        const runningPorts = result.toString().trim().split('\n')

        if (!runningPorts.includes('5000')) {
            throw new ProjectErrorException('PORT_NOT_MEET_REQUIREMENT')
        }
    }

    private stopContainer() {
        execSync('docker kill assistest')
    }
}

export default ContainerService