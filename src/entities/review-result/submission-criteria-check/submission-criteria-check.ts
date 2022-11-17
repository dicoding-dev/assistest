import ReviewChecklistResult from "../review-checklist-result";
import ResultTestFailure from "../../../service/postman-runner/failure-test";

interface SubmissionCriteriaCheck {
    reviewChecklistResult: Array<ReviewChecklistResult>
    failurePostmanTest: Array<ResultTestFailure>;
    approvalStatus: boolean
}

export default SubmissionCriteriaCheck