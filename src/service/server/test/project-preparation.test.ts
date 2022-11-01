import SubmissionProject from "../../../domain/sever/object/submission-project";
import * as fs from "fs";
import ProjectPreparation from "../project-preparation";
import ProjectPath from "../../../domain/sever/object/project-path";

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