import CourseSubmissionAcception from "../course-submission-acception/course-submission-acception";
import SubmissionErrorException from "../../../exception/submission-error-exception";
import CourseSubmissionRejection from "../course-submission-rejection/course-submission-rejection";
import EslintCheckResult from "../../../service/eslint-checker/eslint-check-result";
import SubmissionCriteriaCheck from "../submission-criteria-check/submission-criteria-check";
import ReviewResult, {ReviewResultStatus} from "./review-result";
import SubmissionRatingFactory from "../../../factories/submission-rating/submission-rating-factory";
import PostReviewMethod from "../post-review-method";

class CourseSubmissionReview {
    private readonly submissionCriteriaCheck: SubmissionCriteriaCheck;
    private readonly rejectException?: SubmissionErrorException;
    private readonly eslintCheckResult?: EslintCheckResult;

    constructor(
        submissionCriteriaCheck: SubmissionCriteriaCheck,
        eslintCheckResult?: EslintCheckResult,
        rejectException?: SubmissionErrorException
    ) {
        this.rejectException = rejectException;
        this.submissionCriteriaCheck = submissionCriteriaCheck;
        this.eslintCheckResult = eslintCheckResult;
    }


    review() {
        if (this.rejectException) {
            return this.generateRejection(this.rejectException)
        }
        return this.generateApproval()
    }


    private generateApproval(): ReviewResult {
        const submissionRatingGenerator = new SubmissionRatingFactory(this.submissionCriteriaCheck.failurePostmanTest, this.eslintCheckResult)
        const courseSubmissionAcception = new CourseSubmissionAcception(this.submissionCriteriaCheck, submissionRatingGenerator)
        courseSubmissionAcception.accept()

        return <ReviewResult>{
            rating: courseSubmissionAcception.rating,
            message: courseSubmissionAcception.messages,
            status: ReviewResultStatus.Approve,
            postReviewMethod: PostReviewMethod.Draft,
            checklist: this.submissionCriteriaCheck.reviewChecklistResult
        }
    }

    private generateRejection(submissionErrorException: SubmissionErrorException): ReviewResult {
        const courseSubmissionRejection = new CourseSubmissionRejection(submissionErrorException, this.submissionCriteriaCheck)
        courseSubmissionRejection.reject()


        return <ReviewResult>{
            rating: 0,
            message: courseSubmissionRejection.messages,
            postReviewMethod: courseSubmissionRejection.postReviewMethod,
            status: ReviewResultStatus.Reject,
            checklist: this.submissionCriteriaCheck.reviewChecklistResult
        }
    }
}

export default CourseSubmissionReview
