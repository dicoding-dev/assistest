import EslintCheckResult from "../eslint-check/eslint-check-result";
import ResultTestFailure from "../../service/postman-runner/failure-test";

class ReviewResult {
    private readonly _failurePostmanTest: Array<ResultTestFailure>;
    private readonly _eslintCheckResult: EslintCheckResult;
    private _approved = false;
    private _rating = 0


    constructor(failurePostmanTest: Array<ResultTestFailure>, eslintCheckResult: EslintCheckResult) {
        this._failurePostmanTest = failurePostmanTest;
        this._eslintCheckResult = eslintCheckResult;

        this.decideApproveOrNot()
        this.setRatingSubmission()
    }


    private setRatingSubmission() {
        if (!this._approved) {
            return
        }

        this._rating = 3

        if (this._eslintCheckResult.isSuccess) {
            this._rating++
        }

        if (this._failurePostmanTest.filter(resultTestFailure => resultTestFailure.name.includes('[Optional]')).length === 0) {
            this._rating++
        }
    }

    private decideApproveOrNot() {
        const failureMandatoryTest = this._failurePostmanTest.filter(resultTestFailure => resultTestFailure.name.includes('[Mandatory]'))
        this._approved = failureMandatoryTest.length < 1;
    }

    get eslintCheckResult(): EslintCheckResult {
        return this._eslintCheckResult;
    }
    get failurePostmanTest(): Array<ResultTestFailure> {
        return this._failurePostmanTest;
    }
    get rating(): number {
        return this._rating;
    }

    get approved(): boolean {
        return this._approved;
    }

}

export default ReviewResult