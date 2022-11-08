import ResultTestFailure from "../../service/postman-runner/failure-test";
import EslintCheckResult from "../eslint-check/eslint-check-result";

class SubmissionRatingGenerator {

    private readonly _rating: number;

    constructor(failurePostmanTest: Array<ResultTestFailure>, eslintCheckResult: EslintCheckResult) {
        this._rating = 3

        if (eslintCheckResult.isSuccess) {
            this._rating++
        }

        if (failurePostmanTest.filter(resultTestFailure => resultTestFailure.name.includes('[Optional]')).length === 0) {
            this._rating++
        }
    }

    get rating() {
        return this._rating
    }

}

export default SubmissionRatingGenerator