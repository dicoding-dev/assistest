import ResultTestFailure from "../../../service/postman-runner/failure-test";

interface SubmissionCriteriaCheck {
    reviewChecklistResult: Array<ReviewChecklistResult>
    failurePostmanTest: Array<ResultTestFailure>;
    approvalStatus: boolean
}


export interface ReviewChecklistResult {
    name: string,
    pass: boolean,
    requirement: Array<string>,
    reason?: Array<ResultTestFailure>
}

export default SubmissionCriteriaCheck