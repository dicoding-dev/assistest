import {execSync} from "child_process";
import EslintCheckResult from "./eslint-check-result";
import SubmissionProject from "../../entities/submission-project/submission-project";


class EslintChecker {
    check(submissionProject: SubmissionProject): EslintCheckResult {
        const packageJSONContent = submissionProject.packageJsonContent
        if (!packageJSONContent.dependencies?.eslint && !packageJSONContent.devDependencies?.eslint) {
            return {isSuccess: false, code: 'ESLINT_NOT_INSTALLED'}
        }

        try {
            const result = execSync('npx eslint ./ --rule \'linebreak-style:off\'', {
                cwd: submissionProject.packageJsonPath,
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