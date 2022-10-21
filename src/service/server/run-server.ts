import Server from "../../domain/sever/object/server";
import {exec} from "child_process";
import * as tcpPortUsed from 'tcp-port-used';
import InvariantException from "../../exception/invariant-exception";


class RunServer {

    async run(server: Server) {
        await this.validateBeforeStart(server)
        const {runnerCommand, projectPath, port} = server
        const command = `npm ${runnerCommand}`
        const runningServer = exec(command, {cwd: projectPath});

        runningServer.stdout.on('data', async (data) => {
            console.log(`stdout ${data}`);
        });

        runningServer.stderr.on('data', (data) => {
            console.log(`stderr ${data}`)
        });

        try {
            await tcpPortUsed.waitUntilUsed(port, null, 2000)
        }catch (e) {
            throw new Error(`Server cannot started
            message: ${e.message}
            command: ${command}
            path: ${projectPath}`)
        }
    }

      private async validateBeforeStart({port, host}) {
        const isUsed = await tcpPortUsed.check(port, host)

        if (isUsed) {
            throw new InvariantException(`Port ${port} is used`)
        }
    }
}

export default RunServer