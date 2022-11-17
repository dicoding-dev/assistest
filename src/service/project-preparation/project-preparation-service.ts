import {execSync} from "child_process";
import SubmissionProject from "../../entities/submission-project/submission-project";

class ProjectPreparationService {
    async install(submissionProject: SubmissionProject){
        execSync('npm install', {cwd: submissionProject.packageJsonPath})
    }
}

export default ProjectPreparationService