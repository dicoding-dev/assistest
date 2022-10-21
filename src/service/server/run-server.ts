import Server from "../../domain/sever/object/server";
import * as tcpPortUsed from 'tcp-port-used';
import InvariantException from "../../exception/invariant-exception";


class RunServer {
    async run(server: Server) {
        await this.validateBeforeStart(server)

    }

    async validateBeforeStart({port, host}) {
        let isUsed = true
        try {
            isUsed = await tcpPortUsed.check(port, host)
        } catch (e) {
            throw new Error(e.message)
        }

        if (isUsed) {
            throw new InvariantException(`Port ${port} is used`)
        }
    }
}

export default RunServer