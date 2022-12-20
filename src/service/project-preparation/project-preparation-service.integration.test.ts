import * as fs from "fs";
import ProjectPreparationService from "./project-preparation-service";
import SubmissionProject from "../../entities/submission-project/submission-project";

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
        expect(isNodeModulesExist).toBeTruthy()

        resetTestFile(submissionProject.packageJsonPath)
    });

    async function resetTestFile(directory: string) {
        fs.rmSync(`${directory}/node_modules`, {recursive: true, force: true})
        fs.rmSync(`${directory}/package-lock.json`)
    }
})