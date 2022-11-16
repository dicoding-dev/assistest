import PostmanTestFailedException from "../../../exception/postman-test-failed-exception";
import ResultTestFailure from "../../../service/postman-runner/failure-test";
import SubmissionCriteriaCheck from "../submission-criteria-check/submission-criteria-check";
import ReviewResult, {ReviewResultStatus} from "../review-result";
import SubmissionRatingGenerator from "../submission-rating-generator";
import CourseSubmissionAcception from "../course-submission-acception/course-submission-acception";
import SubmissionErrorException from "../../../exception/submission-error-excepion";
import CourseSubmissionRejection from "../course-submission-rejection/course-submission-rejection";
import EslintCheckResult from "../../eslint-check/eslint-check-result";

class CourseSubmissionReview {
    private readonly submissionCriteriaCheck: SubmissionCriteriaCheck;
    private readonly failurePostmanTest: ResultTestFailure[];
    private readonly eslintCheckResult?: EslintCheckResult;

    constructor(
        submissionCriteriaCheck: SubmissionCriteriaCheck,
        failurePostmanTest: ResultTestFailure[],
        eslintCheckResult?: EslintCheckResult
    ) {
        this.submissionCriteriaCheck = submissionCriteriaCheck;
        this.failurePostmanTest = failurePostmanTest;
        this.eslintCheckResult = eslintCheckResult;
    }


    review(rejectException?: SubmissionErrorException) {
        if (rejectException) {
            return this.generateRejection(rejectException)
        }

        if (this.submissionCriteriaCheck.approvalStatus === false) {
            const e = new PostmanTestFailedException('', this.failurePostmanTest)
            return this.generateRejection(e)
        }

        return this.generateApproval()
    }


    private generateApproval(): ReviewResult {
        const submissionRatingGenerator = new SubmissionRatingGenerator(this.failurePostmanTest, this.eslintCheckResult)
        const courseSubmissionAcception = new CourseSubmissionAcception(this.submissionCriteriaCheck.reviewChecklistResult, submissionRatingGenerator)
        courseSubmissionAcception.accept()

        return <ReviewResult>{
            rating: courseSubmissionAcception.rating,
            message: courseSubmissionAcception.messages,
            status: ReviewResultStatus.Approve,
            checklist: courseSubmissionAcception.reviewChecklistResults
        }
    }

    private generateRejection(submissionErrorException: SubmissionErrorException): ReviewResult {
        const courseSubmissionRejection = new CourseSubmissionRejection(submissionErrorException, this.submissionCriteriaCheck.reviewChecklistResult)
        courseSubmissionRejection.reject()


        return <ReviewResult>{
            rating: 0,
            message: courseSubmissionRejection.messages,
            status: ReviewResultStatus.Reject,
            checklist: courseSubmissionRejection.reviewChecklistResults
        }
    }
}

export default CourseSubmissionReview