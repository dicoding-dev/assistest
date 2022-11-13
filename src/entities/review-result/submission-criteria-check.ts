import ResultTestFailure from "../../service/postman-runner/failure-test";
import ReviewChecklistResult from "./review-checklist-result";
import SubmissionChecklist from "../../conifg/submission-checklist";

class SubmissionCriteriaCheck {
    private _unfulfilledCriteria: Array<ReviewChecklistResult>
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

        this._unfulfilledCriteria = this._reviewChecklistResult.filter(criteria => criteria.pass === false);
    }

    get approvalStatus(): boolean {
        return this._unfulfilledCriteria.length < 1
    }

    get reviewChecklistResult(): Array<ReviewChecklistResult> {
        return this._reviewChecklistResult;
    }
}

export default SubmissionCriteriaCheck