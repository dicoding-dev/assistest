import * as fs from "fs";
import ProjectPath from "../../entities/project-path/project-path";
import ProjectPreparation from "./project-preparation";
import SubmissionProject from "../../entities/submission-project/submission-project";

describe('project preparation test', () => {
    it('should install project properly', function () {
        const submissionProject = new SubmissionProject(new ProjectPath('./test/student-project/project-with-dependencies'), '', 0, 'test')

        const projectPreparation = new ProjectPreparation(submissionProject)
        projectPreparation.install()

        const isNodeModulesExist = fs.existsSync(`${submissionProject.projectPath}/node_modules`)
        expect(isNodeModulesExist).toBeTruthy()

        resetTestFile(submissionProject.projectPath)
    });

    async function resetTestFile(directory: string) {
        fs.rmSync(`${directory}/node_modules`, { recursive: true, force: true })
        fs.rmSync(`${directory}/package-lock.json`)
    }
})