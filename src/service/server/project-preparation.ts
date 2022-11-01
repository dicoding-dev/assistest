import SubmissionProject from "../../domain/sever/object/submissionProject";
import {execSync} from "child_process";

class ProjectPreparation{
    private submissionProject: SubmissionProject;
    constructor(submissionProject: SubmissionProject) {
        this.submissionProject = submissionProject;
    }

    async install(){
        execSync('npm install', {cwd: this.submissionProject.projectPath})
    }
}

export default ProjectPreparation