import SubmissionProject from "./submission-project";
import * as fs from "fs";
import ProjectPath from "../project-path/project-path";
import ProjectErrorException from "../../exception/project-error-exception";

jest.mock('fs');
const mockFS: jest.Mocked<typeof fs> = <jest.Mocked<typeof fs>>fs

describe('create submission project test', () => {
    it('should throw error when project path not contain package.json', function () {
        mockFS.existsSync.mockReturnValue(false)
        expect(() => createSubmissionProject('./xxxx')).toThrow(new ProjectErrorException('PATH_NOT_CONTAIN_PACKAGE_JSON'))
    });

    it('should throw error when package.json cannot be parsed', function () {
        mockFS.existsSync.mockReturnValue(true)

        mockFS.readFileSync.mockReturnValue('{ missing curly braces')
        expect(() => createSubmissionProject('./xxxx')).toThrow(new ProjectErrorException('CANNOT_PARSE_PACKAGE_JSON'))
    });

    it('should throw error when package.json not contain scripts runner', function () {
        mockFS.existsSync.mockReturnValue(true)

        mockFS.readFileSync.mockReturnValue('{ }')
        expect(() => createSubmissionProject('./xxxx')).toThrow(new ProjectErrorException('PACKAGE_JSON_NOT_CONTAIN_SCRIPT_PROPERTY'))
    });


    it('should throw error when runner script not found', function () {
        mockFS.existsSync.mockReturnValue(true)
        mockFS.readFileSync.mockReturnValue('{ "scripts": { "start": "node src/index.js" }}')
        expect(() => createSubmissionProject('.', '', 0, 'invalid-runner')).toThrow(new ProjectErrorException('RUNNER_SCRIPT_NOT_FOUND'))
    });

    it('should create server properly', function () {
        const submissionProject = createSubmissionProject('.', 'localhost', 5000, 'start')
        expect(submissionProject.projectPath).toStrictEqual('.')
        expect(submissionProject.host).toStrictEqual('localhost')
        expect(submissionProject.port).toStrictEqual(5000)
        expect(submissionProject.runnerCommand).toStrictEqual('start')
    });

    const createSubmissionProject = (
        submissionPath = '', host = '', port = 0, runnerCommand = ''
    ) => {
        const mockProjectPath = <ProjectPath>{}
        mockProjectPath.toString = jest.fn(()=>submissionPath)
        return new SubmissionProject(mockProjectPath, host, port, runnerCommand);
    }
})