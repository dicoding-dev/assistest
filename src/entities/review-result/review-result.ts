import ReviewChecklistResult from "./review-checklist-result";

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