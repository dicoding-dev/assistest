import {SubmissionRequirement} from "../../../config/submission-requirement";
import PostReviewMethod from "../post-review-method";

interface ReviewResult {
    rating: number,
    message: string,
    status: ReviewResultStatus,
    checklist: SubmissionRequirement,
    postReviewMethod: PostReviewMethod
}

export enum ReviewResultStatus {
    Approve = "Approve",
    Reject = "Reject",
}

export default ReviewResult
