import ReviewChecklistResult from "../review-checklist-result";
import ResultTestFailure from "../../../service/postman-runner/failure-test";
import SubmissionChecklist from "../../../conifg/submission-checklist";

class SubmissionCriteriaCheck {
    private _reviewChecklistResult: Array<ReviewChecklistResult>
    private failurePostmanTest: Array<ResultTestFailure>;
    private submissionChecklists: SubmissionChecklist[];
    private isProjectError: boolean;

    constructor(submissionChecklists: SubmissionChecklist[], failurePostmanTest: Array<ResultTestFailure>, isProjectError = false) {
        this.submissionChecklists = submissionChecklists;
        this.failurePostmanTest = failurePostmanTest;
        this.isProjectError = isProjectError;
    }

    public check(){
        this._reviewChecklistResult = this.submissionChecklists.map(criteria => {
            const unfulfilledRequirement = this.failurePostmanTest.filter(testResult => criteria.requirements.includes(testResult.name))
            const checklistPass = !this.isProjectError && unfulfilledRequirement.length < 1
            return <ReviewChecklistResult>{
                name: criteria.name,
                reason: unfulfilledRequirement,
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
}

export default SubmissionCriteriaCheck