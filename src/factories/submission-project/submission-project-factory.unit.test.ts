import * as fs from "fs";
import ProjectErrorException from "../../exception/project-error-exception";
import SubmissionProjectFactory from "./submission-project-factory";
import getSubmissionRequirement from "../../config/submission-requirement";

jest.mock('fs');
const mockFS: jest.Mocked<typeof fs> = <jest.Mocked<typeof fs>>fs

describe('create submission project test', () => {
    const submissionProjectFactory  = new SubmissionProjectFactory()
    const submissionRequirement = getSubmissionRequirement()

    it('should throw error when project path not contain package.json', function () {
        expect(() => submissionProjectFactory.create(submissionRequirement, null))
            .toThrow(new ProjectErrorException('PATH_NOT_CONTAIN_PACKAGE_JSON'))
        expect(submissionRequirement.PROJECT_HAVE_CORRECT_RUNNER_SCRIPT.status).toBeFalsy()
    });

    it('should throw error when package.json cannot be parsed', function () {
        mockFS.readFileSync.mockReturnValue('{ missing curly braces')

        expect(() => submissionProjectFactory.create(submissionRequirement, './xxxx'))
            .toThrow(new ProjectErrorException('CANNOT_PARSE_PACKAGE_JSON'))
        expect(submissionRequirement.PROJECT_HAVE_CORRECT_RUNNER_SCRIPT.status).toBeFalsy()

    });

    it('should throw error when package.json not contain scripts runner', function () {
        mockFS.readFileSync.mockReturnValue('{ }')

        expect(() => submissionProjectFactory.create(submissionRequirement, './xxxx'))
            .toThrow(new ProjectErrorException('PACKAGE_JSON_NOT_CONTAIN_SCRIPT_PROPERTY'))
        expect(submissionRequirement.PROJECT_HAVE_CORRECT_RUNNER_SCRIPT.status).toBeFalsy()

    });


    it('should throw error when runner script not found', function () {
        mockFS.readFileSync.mockReturnValue('{ "scripts": { "start--dev": "node src/index.js" }}')

        expect(() => submissionProjectFactory.create(submissionRequirement,'.'))
            .toThrow(new ProjectErrorException('RUNNER_SCRIPT_NOT_FOUND'))
        expect(submissionRequirement.PROJECT_HAVE_CORRECT_RUNNER_SCRIPT.status).toBeFalsy()

    });

    it('should throw error when project contain database dependency', function () {
        mockFS.readFileSync.mockReturnValue('{ "scripts": { }, "dependencies": { "mysql": 10.2 }}')

        expect(() => submissionProjectFactory.create(submissionRequirement,'.'))
            .toThrow(new ProjectErrorException('PROJECT_CONTAIN_DATABASE_DEPENDENCY'))
    });

    it('should throw error when project contain other framework', function () {
        mockFS.readFileSync.mockReturnValue('{ "scripts": { }, "dependencies": { "express": 10.2 }}')

        expect(() => submissionProjectFactory.create(submissionRequirement,'.'))
            .toThrow(new ProjectErrorException('PROJECT_CONTAIN_OTHER_FRAMEWORK_DEPENDENCY'))
    });

    it('should throw error when project contains node modules', function () {
        mockFS.readFileSync.mockReturnValue('{ "scripts": { "start": "node src/index.js" }}')
        mockFS.existsSync.mockReturnValue(true)

        expect(() => submissionProjectFactory.create(submissionRequirement,'.'))
            .toThrow(new ProjectErrorException('PROJECT_CONTAIN_NODE_MODULES'))
    });

    it('should create submission project properly', function () {
        mockFS.readFileSync.mockReturnValue('{ "scripts": { "start": "node src/index.js" }}')
        mockFS.existsSync.mockReturnValue(false)

        const submissionProject = submissionProjectFactory
            .create(submissionRequirement, '/home/app/1234')
        expect(submissionProject.packageJsonContent).toStrictEqual({ "scripts": { "start": "node src/index.js" }})
        expect(submissionProject.packageJsonPath).toStrictEqual('/home/app/1234')
        expect(submissionRequirement.PROJECT_HAVE_CORRECT_RUNNER_SCRIPT.status).toBeTruthy()
    });


})
