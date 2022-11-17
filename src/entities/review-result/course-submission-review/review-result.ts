import {ReviewChecklistResult} from "../submission-criteria-check/submission-criteria-check";

interface ReviewResult {
    rating: number,
    message: string,
    status: ReviewResultStatus,
    checklist: ReviewChecklistResult[]
}

export enum ReviewResultStatus {
    Approve = "Approve",
    Reject = "Reject",
}

export default ReviewResult