import {execSync} from "child_process";
import SubmissionProject from "../../entities/submission-project/submission-project";
import EslintCheckResult from "./eslint-check-result";


class EslintChecker {
    private submissionProject: SubmissionProject;

    constructor(submissionProject: SubmissionProject) {
        this.submissionProject = submissionProject;
    }

    check(): EslintCheckResult {
        const packageJSONContent = this.submissionProject.packageJSONContent
        if (!packageJSONContent.dependencies?.eslint && !packageJSONContent.devDependencies?.eslint) {
            return {isSuccess: false, code: 'ESLINT_NOT_INSTALLED'}
        }

        try {
            const result = execSync('npx eslint ./ --rule \'linebreak-style:off\'', {
                cwd: this.submissionProject.projectPath,
                stdio: "pipe"
            })
            return {isSuccess: true, code: 'NO_ERROR_FROM_ESLINT', reason: result.toString()}
        } catch
            (e) {
            if (e.stderr.toString()) {
                return {isSuccess: false, code: 'ESLINT_ERROR', reason: e.stderr.toString()}
            }

            if (e.stdout.toString()) {
                return {isSuccess: false, code: 'ESLINT_ERROR', reason: e.stdout.toString()}
            }

            throw new Error('Error when check eslint' + e.message)
        }
    }
}

export default EslintChecker