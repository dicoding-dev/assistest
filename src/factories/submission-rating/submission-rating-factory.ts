import ResultTestFailure from "../../service/postman-runner/failure-test";
import EslintCheckResult from "../../service/eslint-checker/eslint-check-result";

class SubmissionRatingFactory {

    private readonly _rating: number;
    private readonly _eslintCheckResult: EslintCheckResult;

    constructor(failurePostmanTest: Array<ResultTestFailure>, eslintCheckResult: EslintCheckResult) {
        this._rating = 3
        this._eslintCheckResult = eslintCheckResult

        if (eslintCheckResult.isSuccess) {
            this._rating++
        }

        if (this.isAllOptionalTestFullFilled(failurePostmanTest)) {
            this._rating++
        }
    }

    private isAllOptionalTestFullFilled(failurePostmanTest: Array<ResultTestFailure>): boolean {
        return failurePostmanTest.filter(resultTestFailure => resultTestFailure.name.includes('[Optional]')).length === 0
    }

    get rating() {
        return this._rating
    }

    get eslintCheckResult(): EslintCheckResult{
        return this._eslintCheckResult
    }
}

export default SubmissionRatingFactory