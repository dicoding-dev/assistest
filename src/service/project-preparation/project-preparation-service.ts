import {execSync} from "child_process";
import SubmissionProject from "../../entities/submission-project/submission-project";

//service
class ProjectPreparationService {
    private submissionProject: SubmissionProject;
    constructor(submissionProject: SubmissionProject) {
        this.submissionProject = submissionProject;
    }

    async install(){
        execSync('npm install', {cwd: this.submissionProject.packageJsonPath})
    }
}

export default ProjectPreparationService