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
            return new EslintCheckResult(false, 'ESLINT_NOT_INSTALLED')
        }

        try {
            const result = execSync('npx eslint ./ --rule \'linebreak-style:off\'', {cwd: this.submissionProject.projectPath, stdio: "pipe"})
            return new EslintCheckResult(true, 'NO_ERROR_FROM_ESLINT', result.toString())
        } catch (e) {
            if (e.stderr.toString()){
                return new EslintCheckResult(false, 'ESLINT_ERROR', e.stderr.toString())
            }

            if (e.stdout.toString()){
                return new EslintCheckResult(false, 'ESLINT_ERROR', e.stdout.toString())
            }

            throw new Error('Error when check eslint' + e.message)
        }
    }
}

export default EslintChecker