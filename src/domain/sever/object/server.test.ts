import SubmissionProject from "./submissionProject";
import InvariantException from "../../../exception/invariant-exception";
import * as fs from "fs";
import ProjectPath from "./project-path";

jest.mock('fs');
const mockFS: jest.Mocked<typeof fs> = <jest.Mocked<typeof fs>>fs

describe('create submission project test', () => {
    it('should throw error when project path not contain package.json', function () {
        mockFS.existsSync.mockReturnValue(false)
        expect(() => createSubmissionProject('./xxxx')).toThrow(new InvariantException('Path not contain package.json'))
    });

    it('should throw error when package.json cannot be parsed', function () {
        mockFS.existsSync.mockReturnValue(true)

        mockFS.readFileSync.mockReturnValue('{ missing curly braces')
        expect(() => createSubmissionProject('./xxxx')).toThrow(new InvariantException('Cannot parse package.json'))
    });

    it('should throw error when package.json not contain scripts runner', function () {
        mockFS.existsSync.mockReturnValue(true)

        mockFS.readFileSync.mockReturnValue('{ }')
        expect(() => createSubmissionProject('./xxxx')).toThrow(new InvariantException('package.json not contain "scripts" property'))
    });


    it('should throw error when runner script not found', function () {
        mockFS.existsSync.mockReturnValue(true)
        mockFS.readFileSync.mockReturnValue('{ "scripts": { "start": "node src/index.js" }}')
        expect(() => createSubmissionProject('.', '', 0, 'invalid-runner')).toThrow(new InvariantException('Runner script not found'))
    });

    it('should create server properly', function () {
        const submissionProject = createSubmissionProject('.', 'localhost', 5000, 'start')
        expect(submissionProject.projectPath).toStrictEqual('.')
        expect(submissionProject.host).toStrictEqual('localhost')
        expect(submissionProject.port).toStrictEqual(5000)
        expect(submissionProject.runnerCommand).toStrictEqual('start')
    });

    const createSubmissionProject = (
        submissionPath: string = '', host: string = '', port: number = 0, runnerCommand: string = ''
    ) => {
        const mockProjectPath = <ProjectPath>{}
        mockProjectPath.toString = jest.fn(()=>submissionPath)
        return new SubmissionProject(mockProjectPath, host, port, runnerCommand);
    }
})