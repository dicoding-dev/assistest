import * as fs from "fs";
import ProjectPreparationService from "./project-preparation-service";
import SubmissionProject from "../../entities/submission-project/submission-project";
import ServerErrorException from "../../exception/server-error-exception";

describe('project preparation test', () => {
    it('should install project properly', function () {
        const submissionProject = <SubmissionProject>{
            packageJsonPath: './test/student-project/project-with-dependencies',
            packageJsonContent: {
                "name": "project-with-dependencies",
                "version": "1.0.0",
                "description": "",
                "main": "index.js",
                "scripts": {
                    "test": "echo \"Error: no test specified\" && exit 1"
                },
                "keywords": [],
                "author": "",
                "license": "ISC",
                "dependencies": {
                    "nanoid": "^4.0.0"
                }
            },
            runnerCommand: 'start'
        }
        const projectPreparation = new ProjectPreparationService()
        projectPreparation.install(submissionProject)

        const isNodeModulesExist = fs.existsSync(`${submissionProject.packageJsonPath}/node_modules`)
        expect(isNodeModulesExist).toBeFalsy()

        resetTestFile(submissionProject.packageJsonPath)
    });

    it('should throw error when install dependencies is failed', async function () {
        const submissionProject = <SubmissionProject>{
            packageJsonPath: './test/student-project/project-with-bad-dependencies',
            packageJsonContent: {
                "devDependencies": {
                    "@hapi/hapi": "^21.1.2"
                }
            },
            runnerCommand: 'start'
        }
        const projectPreparation = new ProjectPreparationService()
        expect(()=> projectPreparation.install(submissionProject)).toThrow(new ServerErrorException('FAIL_INSTALLING_PACKAGE'))

        const isNodeModulesExist = fs.existsSync(`${submissionProject.packageJsonPath}/node_modules`)
        expect(isNodeModulesExist).toBeFalsy()
    });

    async function resetTestFile(directory: string) {
        fs.rmSync(`${directory}/node_modules`, {recursive: true, force: true})
        fs.rmSync(`${directory}/package-lock.json`)
    }
})
