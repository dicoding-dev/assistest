import Server from "./server";
import InvariantException from "../../../exception/invariant-exception";

describe('create server test', () => {
    it('should throw error when path of project doesn\'t exist', function () {
        expect(() => createServer('./xxxx')).toThrow(new InvariantException('Path doesn\'t exist'))
    });

    const createServer = (
        projectPath: string = '', host:string = '' , port: number = 0, packageJSONScript: string = ''
    ) => {
        return new Server(projectPath, host, port, packageJSONScript);
    }
})