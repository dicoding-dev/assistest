import {SubmissionRequirement} from "../../../config/submission-requirement";

interface ReviewResult {
    rating: number,
    message: string,
    status: ReviewResultStatus,
    checklist: SubmissionRequirement
}

export enum ReviewResultStatus {
    Approve = "Approve",
    Reject = "Reject",
}

export default ReviewResult