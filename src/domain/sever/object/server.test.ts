import Server from "./server";
import InvariantException from "../../../exception/invariant-exception";
import * as fs from "fs";

// jest.mock('fs');
const mockFS: jest.Mocked<typeof fs> = <jest.Mocked<typeof fs>>fs

describe('create server test', () => {
    it('should throw error when project path not contain package.json', function () {
        mockFS.existsSync.mockReturnValue(false)
        expect(() => createServer('./xxxx')).toThrow(new InvariantException('Path not contain package.json'))
    });

    it('should throw error when package.json cannot be parsed', function () {
        mockFS.existsSync.mockReturnValue(true)

        mockFS.readFileSync.mockReturnValue('{ missing curly braces')
        expect(() => createServer('./xxxx')).toThrow(new InvariantException('Cannot parse package.json'))
    });

    it('should throw error when package.json not contain scripts runner', function () {
        mockFS.existsSync.mockReturnValue(true)

        mockFS.readFileSync.mockReturnValue('{ }')
        expect(() => createServer('./xxxx')).toThrow(new InvariantException('package.json not contain "scripts" property'))
    });


    it('should throw error when runner script not found', function () {
        mockFS.existsSync.mockReturnValue(true)
        mockFS.readFileSync.mockReturnValue('{ "scripts": { "start": "node src/index.js" }}')
        expect(() => createServer('.', '', 0, 'invalid-runner')).toThrow(new InvariantException('Runner script not found'))
    });

    it('should create server properly', function () {
        const server = createServer('.', 'localhost', 5000, 'start')
        expect(server.projectPath).toStrictEqual('.')
        expect(server.host).toStrictEqual('localhost')
        expect(server.port).toStrictEqual(5000)
        expect(server.runnerCommand).toStrictEqual('start')
    });

    const createServer = (
        projectPath: string = '', host: string = '', port: number = 0, runnerCommand: string = ''
    ) => {
        return new Server(projectPath, host, port, runnerCommand);
    }
})