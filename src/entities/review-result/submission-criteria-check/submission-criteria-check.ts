import ReviewChecklistResult from "../review-checklist-result";
import ResultTestFailure from "../../../service/postman-runner/failure-test";
import SubmissionChecklist from "../../../conifg/submission-checklist";

class SubmissionCriteriaCheck {
    private _reviewChecklistResult: Array<ReviewChecklistResult>
    private readonly _failurePostmanTest: Array<ResultTestFailure>;
    private submissionChecklists: SubmissionChecklist[];

    constructor(submissionChecklists: SubmissionChecklist[], failurePostmanTest: Array<ResultTestFailure> = null) {
        this.submissionChecklists = submissionChecklists;
        this._failurePostmanTest = failurePostmanTest;
    }

    public check(){
        this._reviewChecklistResult = this.submissionChecklists.map(criteria => {
            const unfulfilledRequirement = this._failurePostmanTest?.filter(testResult => criteria.requirements.includes(testResult.name))
            const checklistPass = unfulfilledRequirement?.length < 1
            return <ReviewChecklistResult>{
                name: criteria.name,
                reason: unfulfilledRequirement ?? [],
                pass: checklistPass,
                requirement: criteria.requirements
            }
        })
    }

    get approvalStatus(): boolean {
        return this._reviewChecklistResult.filter(criteria => criteria.pass === false).length < 1
    }

    get reviewChecklistResult(): Array<ReviewChecklistResult> {
        return this._reviewChecklistResult;
    }

    get failurePostmanTest(): Array<ResultTestFailure> | null {
        return this._failurePostmanTest;
    }
}

export default SubmissionCriteriaCheck