import ReviewResult, {ReviewResultStatus} from "../review-result";
import SubmissionRatingGenerator from "../submission-rating-generator";
import CourseSubmissionAcception from "../course-submission-acception/course-submission-acception";
import SubmissionErrorException from "../../../exception/submission-error-excepion";
import CourseSubmissionRejection from "../course-submission-rejection/course-submission-rejection";
import EslintCheckResult from "../../../service/eslint-checker/eslint-check-result";
import SubmissionCriteriaCheck from "../submission-criteria-check/submission-criteria-check";

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
        const submissionRatingGenerator = new SubmissionRatingGenerator(this.submissionCriteriaCheck.failurePostmanTest, this.eslintCheckResult)
        const courseSubmissionAcception = new CourseSubmissionAcception(this.submissionCriteriaCheck.reviewChecklistResult, submissionRatingGenerator)
        courseSubmissionAcception.accept()

        return <ReviewResult>{
            rating: courseSubmissionAcception.rating,
            message: courseSubmissionAcception.messages,
            status: ReviewResultStatus.Approve,
            checklist: this.submissionCriteriaCheck.reviewChecklistResult
        }
    }

    private generateRejection(submissionErrorException: SubmissionErrorException): ReviewResult {
        const courseSubmissionRejection = new CourseSubmissionRejection(submissionErrorException, this.submissionCriteriaCheck)
        courseSubmissionRejection.reject()


        return <ReviewResult>{
            rating: 0,
            message: courseSubmissionRejection.messages,
            status: ReviewResultStatus.Reject,
            checklist: this.submissionCriteriaCheck.reviewChecklistResult
        }
    }
}

export default CourseSubmissionReview