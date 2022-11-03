import {execSync} from "child_process";
import SubmissionProject from "../../entities/submission-project/submission-project";
import EslintCheckResult from "../../entities/eslint-check/eslint-check-result";


class EslintChecker {
    private submissionProject: SubmissionProject;

    constructor(submissionProject: SubmissionProject) {
        this.submissionProject = submissionProject;
    }

    check(): EslintCheckResult {
        const packageJSONContent = this.submissionProject.packageJSONContent
        if (!packageJSONContent.dependencies?.eslint && !packageJSONContent.devDependencies?.eslint) {
            return new EslintCheckResult(false, 'Eslint not installed')
        }

        try {
            const result = execSync('npx eslint .', {cwd: this.submissionProject.projectPath, stdio: "pipe"})
            return new EslintCheckResult(true, result.toString())
        } catch (e) {
            if (e.stderr.toString()){
                return new EslintCheckResult(false, e.stderr.toString())
            }

            if (e.stdout.toString()){
                return new EslintCheckResult(false, e.stdout.toString())
            }

            throw new Error('Error when check eslint' + e.message)
        }
    }
}

export default EslintChecker