import ResultTestFailure from "../../../service/postman-runner/failure-test";
import {SubmissionRequirement} from "../../../config/submission-requirement";

interface SubmissionCriteriaCheck {
    reviewChecklistResult: SubmissionRequirement
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