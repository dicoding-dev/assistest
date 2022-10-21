import Server from "../../domain/sever/object/server";
import * as tcpPortUsed from 'tcp-port-used';
import InvariantException from "../../exception/invariant-exception";


class RunServer {
    async run(server: Server) {
        await this.validateBeforeStart(server)

    }

      private async validateBeforeStart({port, host}) {
        const isUsed = await tcpPortUsed.check(port, host)

        if (isUsed) {
            throw new InvariantException(`Port ${port} is used`)
        }
    }
}

export default RunServer