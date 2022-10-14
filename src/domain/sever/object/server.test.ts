import Server from "./server";
import InvariantException from "../../../exception/invariant-exception";

describe('create server test', () => {
    it('should throw error when project path not contain package.json', function () {
        expect(() => createServer('./xxxx')).toThrow(new InvariantException('Path not contain package.json'))
    });

    it('should throw error when runner script not found', function () {
        expect(() => createServer('.', '', 0, 'invalid-runner')).toThrow(new InvariantException('Runner script not found'))
    });

    it('should create server properly', function () {
        const server = createServer('.', 'localhost', 5000, 'start')
        expect(server.projectPath).toStrictEqual('.')
        expect(server.host).toStrictEqual('localhost')
        expect(server.port).toStrictEqual(5000)
        expect(server.packageJSONScript).toStrictEqual('start')
    });

    const createServer = (
        projectPath: string = '', host:string = '' , port: number = 0, packageJSONScript: string = ''
    ) => {
        return new Server(projectPath, host, port, packageJSONScript);
    }
})