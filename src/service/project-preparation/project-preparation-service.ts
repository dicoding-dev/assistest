import {execSync} from "child_process";
import SubmissionProject from "../../entities/submission-project/submission-project";
import ServerErrorException from "../../exception/server-error-exception";

class ProjectPreparationService {
    install(submissionProject: SubmissionProject) {
        try {
            execSync('npm install', {cwd: submissionProject.packageJsonPath, stdio: 'pipe', encoding:'utf-8'})
        } catch (e) {
            const errorLog = e.stderr
                .replace(/npm ERR! A complete log of this r.*/gs, '')
                .trim()
            throw new ServerErrorException('FAIL_INSTALLING_PACKAGE', '', [errorLog])
        }
    }
}

export default ProjectPreparationService